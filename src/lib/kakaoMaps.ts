/**
 * Kakao Maps JS SDK async loader.
 *
 * - 키는 빌드 타임 환경변수 VITE_KAKAO_MAP_KEY 에 주입
 * - 도메인은 developers.kakao.com 에서 내 앱 → Web 플랫폼 → 사이트 도메인에
 *   https://00.genomic.cc (+ 로컬 개발 시 http://localhost:5173) 추가해야 함
 * - 자동로드 off(`autoload=false`) 후 window.kakao.maps.load(cb) 로 명시 초기화
 */

const SDK_BASE = "//dapi.kakao.com/v2/maps/sdk.js";
let loadPromise: Promise<void> | null = null;

export function getKakaoMapKey(): string | undefined {
  return import.meta.env.VITE_KAKAO_MAP_KEY;
}

export function loadKakaoMaps(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window undefined"));
  }
  if (window.kakao?.maps) {
    return Promise.resolve();
  }
  const key = getKakaoMapKey();
  if (!key) {
    return Promise.reject(
      new Error("VITE_KAKAO_MAP_KEY not set — build with the env var")
    );
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-kakao-maps-sdk]"
    );
    if (existing) {
      existing.addEventListener("load", () => {
        window.kakao.maps.load(() => resolve());
      });
      existing.addEventListener("error", () => {
        loadPromise = null;
        reject(new Error("Kakao Maps SDK script error"));
      });
      return;
    }
    const script = document.createElement("script");
    script.src = `${SDK_BASE}?appkey=${encodeURIComponent(key)}&autoload=false`;
    script.async = true;
    script.dataset.kakaoMapsSdk = "1";
    script.onload = () => {
      try {
        window.kakao.maps.load(() => resolve());
      } catch (e) {
        loadPromise = null;
        reject(e as Error);
      }
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Kakao Maps SDK network error"));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}
