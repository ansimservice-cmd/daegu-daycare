import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Props {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  zoom?: number;
}

/**
 * 단일 시설 상세 지도. DetailPage의 "오시는 길" 섹션에서 사용.
 * 시설 위치에 마커 찍고 주소/이름을 팝업으로 표시.
 */
export default function FacilityMap({
  lat,
  lng,
  name,
  address,
  zoom = 16,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    const marker = L.marker([lat, lng]).addTo(map);
    marker
      .bindPopup(
        `<div style="min-width:180px;font-family:inherit">
          <div style="font-weight:700;color:#00628d;margin-bottom:4px">${escapeHtml(
            name
          )}</div>
          ${
            address
              ? `<div style="font-size:12px;color:#44474b">${escapeHtml(address)}</div>`
              : ""
          }
        </div>`
      )
      .openPopup();
    mapRef.current = map;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 rounded-lg overflow-hidden"
    />
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
