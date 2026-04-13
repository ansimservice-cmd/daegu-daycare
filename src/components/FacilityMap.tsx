import { useEffect, useRef, useState } from "react";
import { getKakaoMapKey, loadKakaoMaps } from "../lib/kakaoMaps";

interface Props {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

/**
 * Single-facility Kakao Map for the DetailPage.
 * Shows one marker at (lat,lng) with a permanent info overlay.
 */
export default function FacilityMap({ lat, lng, name, address }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getKakaoMapKey()) {
      setError("카카오 지도 키가 설정되지 않았습니다");
      return;
    }
    let cancelled = false;
    let mapInstance: KakaoMap | null = null;
    let overlayInstance: KakaoCustomOverlay | null = null;

    loadKakaoMaps()
      .then(() => {
        if (cancelled) {
          console.warn("[FacilityMap] cancelled before init");
          return;
        }
        if (!containerRef.current) {
          console.warn("[FacilityMap] container ref empty");
          return;
        }
        const kakao = window.kakao;
        if (!kakao?.maps) {
          console.warn("[FacilityMap] window.kakao.maps missing after load");
          setError("Kakao SDK가 초기화되지 않았습니다");
          return;
        }
        const position = new kakao.maps.LatLng(lat, lng);
        mapInstance = new kakao.maps.Map(containerRef.current, {
          center: position,
          level: 3,
        });
        new kakao.maps.Marker({
          position,
          map: mapInstance,
          title: name,
        });

        const popupEl = document.createElement("div");
        popupEl.className = "facility-popup";
        popupEl.innerHTML = `
          <div class="facility-popup-inner">
            <div class="facility-popup-name">${escapeHtml(name)}</div>
            ${
              address
                ? `<div class="facility-popup-addr">${escapeHtml(address)}</div>`
                : ""
            }
          </div>
        `;
        overlayInstance = new kakao.maps.CustomOverlay({
          position,
          content: popupEl,
          yAnchor: 1.35,
          xAnchor: 0.5,
        });
        overlayInstance.setMap(mapInstance);

        // Force a relayout in case the container got measured after Kakao init
        setTimeout(() => {
          if (!cancelled && mapInstance) {
            mapInstance.relayout();
            mapInstance.setCenter(position);
          }
        }, 100);

        setReady(true);
      })
      .catch((e: Error) => {
        console.error("[FacilityMap] load failed", e);
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
      overlayInstance?.setMap(null);
      mapInstance = null;
    };
  }, [lat, lng, name, address]);

  return (
    <>
      <style>{`
        .facility-popup-inner {
          position: relative;
          min-width: 180px;
          background: white;
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 12px 32px rgba(0,35,111,0.25);
          font-family: inherit;
        }
        .facility-popup-inner::after {
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
        .facility-popup-name {
          font-size: 14px;
          font-weight: 700;
          color: #00628d;
          margin-bottom: 4px;
        }
        .facility-popup-addr {
          font-size: 12px;
          color: #44474b;
          line-height: 1.4;
        }
      `}</style>
      {error ? (
        <div className="w-full h-80 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-sm text-amber-800 p-4 text-center">
          {error}
        </div>
      ) : (
        <div className="relative w-full h-80 rounded-lg overflow-hidden bg-surface-low">
          <div ref={containerRef} className="absolute inset-0" />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant pointer-events-none">
              지도 불러오는 중...
            </div>
          )}
        </div>
      )}
    </>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
