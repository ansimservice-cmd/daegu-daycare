/**
 * 정적 샘플 데이터는 cc.genomic.cc (제노믹 플랫폼) D1 centers 테이블로 이관됨.
 * 이 파일은 이제 아래만 담당한다:
 *   1. 타입/훅 re-export — 기존 컴포넌트들이 daycares 경로로 import 중
 *   2. DISTRICTS 메타데이터 (9개 구군)
 *   3. POSTS (알림마당 정적 데이터, 추후 별도 이관 예정)
 */

export type { Daycare } from "./centersApi";
export { useDaycares, fetchDaycares } from "./centersApi";

export const DISTRICTS = [
  { id: "jung", name: "중구" },
  { id: "dong", name: "동구" },
  { id: "seo", name: "서구" },
  { id: "nam", name: "남구" },
  { id: "buk", name: "북구" },
  { id: "suseong", name: "수성구" },
  { id: "dalseo", name: "달서구" },
  { id: "dalseong", name: "달성군" },
  { id: "gunwi", name: "군위군" },
] as const;

export type DistrictId = (typeof DISTRICTS)[number]["id"];

export const POSTS = [
  {
    id: 1,
    category: "notice" as const,
    title: "2024년 대구공공형어린이집 신규 선정 심사 계획 안내",
    date: "2024.05.20",
    views: 1245,
    pinned: true,
    badge: "important",
  },
  {
    id: 2,
    category: "notice" as const,
    title: "제 5회 어린이 사생대회 개최 및 접수 안내 (상금 100만원)",
    date: "2024.05.18",
    views: 892,
    pinned: true,
    badge: "event",
  },
  {
    id: 3,
    category: "notice" as const,
    title: "보육교직원 하반기 직무교육 일자별 장소 안내",
    date: "2024.05.15",
    views: 451,
    pinned: false,
  },
  {
    id: 4,
    category: "jobs" as const,
    title: "[수성구] 푸른숲어린이집 보육교사(담임) 채용 공고",
    date: "2024.05.14",
    views: 2104,
    pinned: false,
  },
  {
    id: 5,
    category: "news" as const,
    title: "영유아 보육법 개정에 따른 시설 안전 점검 가이드라인 배포",
    date: "2024.05.12",
    views: 672,
    pinned: false,
  },
  {
    id: 6,
    category: "notice" as const,
    title: "여름철 감염병 예방 관리 및 대응 체계 강화 요청",
    date: "2024.05.10",
    views: 328,
    pinned: false,
  },
  {
    id: 7,
    category: "jobs" as const,
    title: "[달서구] 햇살어린이집 조리사 및 연장반 교사 채용",
    date: "2024.05.08",
    views: 1556,
    pinned: false,
  },
  {
    id: 8,
    category: "news" as const,
    title: "2024년 하반기 보육료 지원 확대 방안 발표",
    date: "2024.05.06",
    views: 987,
    pinned: false,
  },
];

export type PostCategory = "all" | "notice" | "news" | "jobs";

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  all: "전체",
  notice: "공지사항",
  news: "보육뉴스",
  jobs: "구인구직",
};

export const CATEGORY_COLORS: Record<string, string> = {
  notice: "text-primary",
  news: "text-tertiary",
  jobs: "text-secondary",
};
