import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DISTRICTS, useDaycares } from "../data/daycares";
import { getKakaoMapKey, loadKakaoMaps } from "../lib/kakaoMaps";

// Daegu metro center. level=9 covers all 9 구/군.
const DAEGU = { lat: 35.8714, lng: 128.6014 };
const DAEGU_LEVEL = 9;

const DISTRICT_CENTERS: Record<string, { lat: number; lng: number }> = {
  jung: { lat: 35.8693, lng: 128.6062 },
  dong: { lat: 35.8867, lng: 128.6354 },
  seo: { lat: 35.8716, lng: 128.5593 },
  nam: { lat: 35.8456, lng: 128.5913 },
  buk: { lat: 35.8875, lng: 128.5829 },
  suseong: { lat: 35.8582, lng: 128.6307 },
  dalseo: { lat: 35.8294, lng: 128.5325 },
  dalseong: { lat: 35.7746, lng: 128.4314 },
  gunwi: { lat: 36.2428, lng: 128.5725 },
};

export default function DistrictMap() {
  const navigate = useNavigate();
  const { daycares } = useDaycares();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const overlaysRef = useRef<Array<{ setMap: (m: KakaoMap | null) => void }>>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const districtCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of daycares) m[d.district] = (m[d.district] || 0) + 1;
    return m;
  }, [daycares]);

  // Initialise the map once
  useEffect(() => {
    if (!getKakaoMapKey()) {
      setError("카카오 지도 키가 설정되지 않았습니다");
      return;
    }
    let cancelled = false;
    loadKakaoMaps()
      .then(() => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        const kakao = window.kakao;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(DAEGU.lat, DAEGU.lng),
          level: DAEGU_LEVEL,
        });
        mapRef.current = map;
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // (Re)render overlays whenever daycares change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const kakao = window.kakao;

    // Clear existing
    for (const o of overlaysRef.current) o.setMap(null);
    overlaysRef.current = [];

    // 1) District label overlays
    for (const district of DISTRICTS) {
      const pos = DISTRICT_CENTERS[district.id];
      if (!pos) continue;
      const count = districtCounts[district.id] || 0;

      const el = document.createElement("div");
      el.className = "district-pill";
      el.innerHTML = `
        <span class="district-pill-name">${escapeHtml(district.name)}</span>
        <span class="district-pill-count">${count}</span>
      `;
      el.addEventListener("click", () =>
        navigate(`/search?district=${district.id}`)
      );

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(pos.lat, pos.lng),
        content: el,
        yAnchor: 0.5,
        xAnchor: 0.5,
        clickable: true,
      });
      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    }

    // 2) Daycare markers + popup overlays
    const geocoder = kakao.maps.services?.Geocoder
      ? new kakao.maps.services.Geocoder()
      : null;

    for (const dc of daycares) {
      if (!dc.lat || !dc.lng) continue;
      const initialPosition = new kakao.maps.LatLng(dc.lat, dc.lng);
      const marker = new kakao.maps.Marker({
        position: initialPosition,
        map,
        title: dc.name,
        clickable: true,
      });

      // initialPosition 은 popup 초기 anchor용 (geocoder 보정 전)
      const position = initialPosition;

      const districtName =
        DISTRICTS.find((d) => d.id === dc.district)?.name || "";

      const popupEl = document.createElement("div");
      popupEl.className = "daycare-popup";
      popupEl.innerHTML = `
        <div class="daycare-popup-inner">
          <button class="daycare-popup-close" type="button" aria-label="close">✕</button>
          <div class="daycare-popup-name">${escapeHtml(dc.name)}</div>
          <div class="daycare-popup-district">${escapeHtml(districtName)}</div>
          <div class="daycare-popup-addr">${escapeHtml(dc.address)}</div>
          <button class="daycare-popup-btn" type="button">상세 보기 →</button>
        </div>
      `;
      const popup = new kakao.maps.CustomOverlay({
        position,
        content: popupEl,
        yAnchor: 1.35,
        xAnchor: 0.5,
        clickable: true,
      });

      const closeBtn = popupEl.querySelector<HTMLButtonElement>(
        ".daycare-popup-close"
      );
      closeBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        popup.setMap(null);
      });
      const goBtn = popupEl.querySelector<HTMLButtonElement>(
        ".daycare-popup-btn"
      );
      goBtn?.addEventListener("click", () => navigate(`/daycare/${dc.id}`));

      kakao.maps.event.addListener(marker, "click", () => {
        // 마커 최신 위치(지오코더 보정 후일 수도)에 팝업 표시
        popup.setPosition(marker.getPosition());
        popup.setMap(map);
      });

      // Kakao 지오코더로 주소 → 정확 좌표 보정 (마커 위치만 업데이트, popup은
      // 클릭 시점에 마커 위치 따라감)
      if (geocoder && dc.address) {
        geocoder.addressSearch(dc.address, (result, status) => {
          if (
            status === kakao.maps.services.Status.OK &&
            result.length > 0
          ) {
            const exact = new kakao.maps.LatLng(
              parseFloat(result[0].y),
              parseFloat(result[0].x)
            );
            marker.setPosition(exact);
          }
        });
      }

      overlaysRef.current.push(marker);
      overlaysRef.current.push(popup);
    }
  }, [daycares, districtCounts, navigate]);

  return (
    <div className="relative">
      {error && (
        <div className="bg-amber-50 text-amber-800 border border-amber-200 px-4 py-3 rounded-xl mb-3 text-sm">
          지도를 불러올 수 없습니다: {error}
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-[480px] md:h-[560px] rounded-2xl overflow-hidden shadow-ambient bg-surface-low"
      />
      <p className="text-center text-xs text-on-surface-variant mt-3">
        구 라벨을 클릭하면 구별 검색으로 이동, 마커 클릭 시 상세 정보가
        표시됩니다.
      </p>
      <style>{`
        .district-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.95);
          border: 2px solid #00628d;
          border-radius: 9999px;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,35,111,0.15);
          transition: all 0.15s;
          white-space: nowrap;
        }
        .district-pill:hover {
          background: #00628d;
          transform: scale(1.08);
        }
        .district-pill-name {
          font-size: 11px;
          font-weight: 700;
          color: #00628d;
          line-height: 1;
        }
        .district-pill:hover .district-pill-name { color: white; }
        .district-pill-count {
          font-size: 13px;
          font-weight: 800;
          color: #755700;
          line-height: 1;
          min-width: 14px;
          text-align: center;
        }
        .district-pill:hover .district-pill-count { color: #fff6b8; }

        .daycare-popup {
          pointer-events: auto;
        }
        .daycare-popup-inner {
          position: relative;
          min-width: 220px;
          background: white;
          border-radius: 12px;
          padding: 16px 16px 14px;
          box-shadow: 0 12px 32px rgba(0,35,111,0.25);
          font-family: inherit;
        }
        .daycare-popup-inner::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
        }
        .daycare-popup-close {
          position: absolute;
          top: 6px;
          right: 8px;
          width: 22px;
          height: 22px;
          border: none;
          background: transparent;
          color: #9aa0a6;
          font-size: 14px;
          cursor: pointer;
          line-height: 1;
        }
        .daycare-popup-close:hover { color: #202124; }
        .daycare-popup-name {
          font-size: 15px;
          font-weight: 700;
          color: #00628d;
          margin-bottom: 4px;
          padding-right: 18px;
        }
        .daycare-popup-district {
          font-size: 11px;
          font-weight: 600;
          color: #007cb2;
          margin-bottom: 6px;
        }
        .daycare-popup-addr {
          font-size: 12px;
          color: #44474b;
          line-height: 1.4;
          margin-bottom: 10px;
        }
        .daycare-popup-btn {
          display: inline-block;
          background: #00628d;
          color: white;
          padding: 6px 14px;
          border: none;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .daycare-popup-btn:hover { background: #007cb2; }
      `}</style>
    </div>
  );
}

function escapeHtml(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
