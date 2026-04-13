/**
 * 00.genomic.cc (대구공공형어린이집연합회) 데이터 소스.
 *
 * 예전: src/data/daycares.ts 의 정적 DAYCARES 배열
 * 현재: cc.genomic.cc 플랫폼의 공개 API (/api/centers) 를 런타임에 fetch
 *
 * 이유
 * - 단일 진실(Single Source of Truth): cc의 D1 centers 테이블이 기준
 * - 원장님이 cc 관리자에서 정보를 수정하면 여기도 자동 반영
 * - 보육정보공개 API 동기화(정원/현원/교직원)가 cc에 쌓여 있어 그대로 활용
 *
 * 캐시
 * - 메모리 캐시 + 진행중 Promise 공유로 중복 요청 차단
 * - 새로고침 시 다시 fetch (서버 응답은 Cloudflare edge에서 캐시됨)
 */

import { useEffect, useState } from "react";

const API_BASE = "https://genomic-platform-api.pensive-kim.workers.dev";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&q=80";

export interface Daycare {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  capacity: number;
  current: number;
  teachers: number;
  hasBus: boolean;
  extended: boolean;
  features: string[];
  programs: string[];
  image: string;
  lat: number;
  lng: number;
  /** cc.genomic.cc 커스텀 홈페이지 존재 여부 (향후 교차 링크용) */
  hasCustomHomepage: boolean;
}

interface CenterApiRow {
  id: string;
  name: string;
  category: string;
  district: string | null;
  address: string | null;
  phone: string | null;
  slogan: string | null;
  heroImage: string | null;
  features: string[];
  programs: string[];
  targetAge: string | null;
  operatingHours: string | null;
  lat: number | null;
  lng: number | null;
  hasBus: boolean;
  extendedHours: boolean;
  hasCustomHomepage: boolean;
  capacity: number | null;
  capacityText: string | null;
  currentEnrollment: number | null;
  teacherCount: number | null;
  dataReferenceDate: string | null;
  updatedAt: string;
}

function adaptCenter(c: CenterApiRow): Daycare {
  let image = FALLBACK_IMAGE;
  if (c.heroImage) {
    image = c.heroImage.startsWith("/api/")
      ? `${API_BASE}${c.heroImage}`
      : c.heroImage;
  }
  return {
    id: c.id,
    name: c.name,
    district: c.district || "",
    address: c.address || "",
    phone: c.phone || "",
    capacity: c.capacity ?? 0,
    current: c.currentEnrollment ?? 0,
    teachers: c.teacherCount ?? 0,
    hasBus: c.hasBus,
    extended: c.extendedHours,
    features: c.features || [],
    programs: c.programs || [],
    image,
    lat: c.lat ?? 0,
    lng: c.lng ?? 0,
    hasCustomHomepage: !!c.hasCustomHomepage,
  };
}

let cached: Daycare[] | null = null;
let inflight: Promise<Daycare[]> | null = null;

export async function fetchDaycares(): Promise<Daycare[]> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/centers`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as { centers?: CenterApiRow[] };
      const list = (data.centers || [])
        .filter((c) => c.category === "daycare" && c.district)
        .map(adaptCenter);
      cached = list;
      return list;
    } catch (e) {
      console.error("[daegu-daycare] fetchDaycares failed", e);
      cached = [];
      return [];
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

interface DaycaresState {
  daycares: Daycare[];
  loading: boolean;
  error: Error | null;
}

export function useDaycares(): DaycaresState {
  const [state, setState] = useState<DaycaresState>({
    daycares: cached || [],
    loading: cached === null,
    error: null,
  });

  useEffect(() => {
    if (cached) {
      setState({ daycares: cached, loading: false, error: null });
      return;
    }
    let mounted = true;
    fetchDaycares()
      .then((d) => {
        if (mounted) setState({ daycares: d, loading: false, error: null });
      })
      .catch((e) => {
        if (mounted)
          setState({ daycares: [], loading: false, error: e as Error });
      });
    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
