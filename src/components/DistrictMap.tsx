import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Vite asset imports for Leaflet's default marker (otherwise broken paths)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { DISTRICTS, useDaycares } from "../data/daycares";

// Patch Leaflet default marker icon (Webpack/Vite breaks the implicit paths)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Daegu metro center + zoom. Covers all 9 구/군.
const DAEGU_CENTER: [number, number] = [35.8714, 128.6014];
const DAEGU_ZOOM = 11;

// District center coordinates (approx; used for count labels when there are
// no real markers yet)
const DISTRICT_CENTERS: Record<string, [number, number]> = {
  jung: [35.8693, 128.6062],
  dong: [35.8867, 128.6354],
  seo: [35.8716, 128.5593],
  nam: [35.8456, 128.5913],
  buk: [35.8875, 128.5829],
  suseong: [35.8582, 128.6307],
  dalseo: [35.8294, 128.5325],
  dalseong: [35.7746, 128.4314],
  gunwi: [36.2428, 128.5725],
};

export default function DistrictMap() {
  const navigate = useNavigate();
  const { daycares } = useDaycares();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);

  // Pre-compute district counts for the label overlays
  const districtCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of daycares) {
      map[d.district] = (map[d.district] || 0) + 1;
    }
    return map;
  }, [daycares]);

  // Initialise the map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, {
      center: DAEGU_CENTER,
      zoom: DAEGU_ZOOM,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    // Enable scroll-wheel zoom only after click (avoid hijacking page scroll)
    const container = map.getContainer();
    const onClick = () => map.scrollWheelZoom.enable();
    const onLeave = () => map.scrollWheelZoom.disable();
    container.addEventListener("click", onClick);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("click", onClick);
      container.removeEventListener("mouseleave", onLeave);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw/refresh markers whenever daycares change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous
    for (const l of layersRef.current) l.remove();
    layersRef.current = [];

    // 1) District count labels (divIcon)
    for (const district of DISTRICTS) {
      const pos = DISTRICT_CENTERS[district.id];
      if (!pos) continue;
      const count = districtCounts[district.id] || 0;
      const labelIcon = L.divIcon({
        className: "daegu-district-label",
        html: `<button type="button" data-district="${district.id}" class="district-label-btn">
          <span class="district-name">${district.name}</span>
          <span class="district-count">${count}</span>
        </button>`,
        iconSize: [64, 44],
        iconAnchor: [32, 22],
      });
      const marker = L.marker(pos, {
        icon: labelIcon,
        interactive: true,
        keyboard: false,
        bubblingMouseEvents: false,
      }).addTo(map);
      marker.on("click", () => navigate(`/search?district=${district.id}`));
      layersRef.current.push(marker);
    }

    // 2) Real daycare markers with popup
    for (const dc of daycares) {
      if (!dc.lat || !dc.lng) continue;
      const m = L.marker([dc.lat, dc.lng]).addTo(map);
      const districtName =
        DISTRICTS.find((d) => d.id === dc.district)?.name || "";
      const popupHtml = `
        <div style="min-width:200px;font-family:inherit">
          <div style="font-weight:700;font-size:15px;color:#00628d;margin-bottom:4px">${escapeHtml(
            dc.name
          )}</div>
          <div style="font-size:11px;color:#007cb2;margin-bottom:6px">${escapeHtml(
            districtName
          )}</div>
          <div style="font-size:12px;color:#44474b;margin-bottom:8px;line-height:1.4">${escapeHtml(
            dc.address
          )}</div>
          <a href="/daycare/${encodeURIComponent(
            dc.id
          )}" data-daycare-id="${encodeURIComponent(
            dc.id
          )}" class="daycare-popup-link" style="display:inline-block;background:#00628d;color:white;padding:6px 14px;border-radius:9999px;font-size:12px;font-weight:700;text-decoration:none">상세 보기 →</a>
        </div>
      `;
      m.bindPopup(popupHtml);
      layersRef.current.push(m);
    }
  }, [daycares, districtCounts, navigate]);

  // Intercept popup link clicks to use SPA navigation
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onPopupOpen = (e: L.PopupEvent) => {
      const root = e.popup.getElement();
      if (!root) return;
      const link = root.querySelector<HTMLAnchorElement>(".daycare-popup-link");
      if (link) {
        link.addEventListener("click", (ev) => {
          ev.preventDefault();
          const id = link.getAttribute("data-daycare-id");
          if (id) navigate(`/daycare/${id}`);
        });
      }
    };
    map.on("popupopen", onPopupOpen);
    return () => {
      map.off("popupopen", onPopupOpen);
    };
  }, [navigate]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="w-full h-[480px] md:h-[560px] rounded-2xl overflow-hidden shadow-ambient"
      />
      <p className="text-center text-xs text-on-surface-variant mt-3">
        지도 위 숫자는 해당 구의 어린이집 개수입니다. 클릭하면 구별 목록으로
        이동합니다. 지도 위 클릭 후 스크롤로 확대/축소 가능.
      </p>
      <style>{`
        .daegu-district-label { background: transparent !important; border: none !important; }
        .district-label-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 10px;
          background: rgba(255,255,255,0.92);
          border: 2px solid #00628d;
          border-radius: 9999px;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,35,111,0.15);
          transition: all 0.15s;
          white-space: nowrap;
        }
        .district-label-btn:hover {
          background: #00628d;
          color: white;
          transform: scale(1.08);
        }
        .district-label-btn .district-name {
          font-size: 11px;
          font-weight: 700;
          color: #00628d;
          line-height: 1;
        }
        .district-label-btn:hover .district-name { color: white; }
        .district-label-btn .district-count {
          font-size: 13px;
          font-weight: 800;
          color: #755700;
          line-height: 1;
        }
        .district-label-btn:hover .district-count { color: #fff6b8; }
        .leaflet-popup-content-wrapper { border-radius: 12px; }
        .leaflet-popup-content { margin: 12px 14px; }
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
