/* Minimal Kakao Maps JS SDK type stubs — we only touch the surface we need. */
declare global {
  interface Window {
    kakao: KakaoNamespace;
  }

  interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
  }

  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void;
    setLevel(level: number): void;
    getLevel(): number;
    relayout(): void;
    panTo(latlng: KakaoLatLng): void;
  }

  interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
    getPosition(): KakaoLatLng;
  }

  interface KakaoInfoWindow {
    open(map: KakaoMap, marker?: KakaoMarker): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
  }

  interface KakaoCustomOverlay {
    setMap(map: KakaoMap | null): void;
    setPosition(latlng: KakaoLatLng): void;
  }

  interface KakaoNamespace {
    maps: {
      load(cb: () => void): void;
      LatLng: new (lat: number, lng: number) => KakaoLatLng;
      Map: new (
        container: HTMLElement,
        options: { center: KakaoLatLng; level: number; draggable?: boolean }
      ) => KakaoMap;
      Marker: new (options: {
        position: KakaoLatLng;
        map?: KakaoMap;
        title?: string;
        clickable?: boolean;
      }) => KakaoMarker;
      InfoWindow: new (options: {
        content: string | HTMLElement;
        removable?: boolean;
      }) => KakaoInfoWindow;
      CustomOverlay: new (options: {
        position: KakaoLatLng;
        content: string | HTMLElement;
        yAnchor?: number;
        xAnchor?: number;
        clickable?: boolean;
      }) => KakaoCustomOverlay;
      event: {
        addListener(
          target: KakaoMarker | KakaoMap,
          type: string,
          handler: () => void
        ): void;
      };
    };
  }
}

export {};
