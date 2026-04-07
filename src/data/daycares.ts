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
}

export const DISTRICTS = [
  { id: 'jung', name: '중구', count: 8 },
  { id: 'dong', name: '동구', count: 15 },
  { id: 'seo', name: '서구', count: 10 },
  { id: 'nam', name: '남구', count: 12 },
  { id: 'buk', name: '북구', count: 18 },
  { id: 'suseong', name: '수성구', count: 22 },
  { id: 'dalseo', name: '달서구', count: 25 },
  { id: 'dalseong', name: '달성군', count: 14 },
  { id: 'gunwi', name: '군위군', count: 3 },
] as const;

export type DistrictId = typeof DISTRICTS[number]['id'];

export const DAYCARES: Daycare[] = [
  {
    id: 'happy-child',
    name: '행복한 아이 어린이집',
    district: 'jung',
    address: '대구광역시 중구 달구벌대로 2100 (봉산동)',
    phone: '053-421-1234',
    capacity: 45,
    current: 38,
    teachers: 12,
    hasBus: true,
    extended: true,
    features: ['영아전담', '야간연장'],
    programs: ['오감 만족 창의 놀이', '매주 목요일 숲 체험 학습', '원어민 영어 놀이 교실'],
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=400&fit=crop',
    lat: 35.8714,
    lng: 128.6014,
  },
  {
    id: 'green-forest',
    name: '푸른숲 어린이집',
    district: 'suseong',
    address: '대구광역시 수성구 들안로 215 (만촌동)',
    phone: '053-763-5678',
    capacity: 60,
    current: 52,
    teachers: 15,
    hasBus: true,
    extended: true,
    features: ['장애통합', '야간연장'],
    programs: ['자연관찰 프로그램', '음악 놀이 교실', '체육 활동'],
    image: 'https://images.unsplash.com/photo-1576495169037-3a891e4727b2?w=600&h=400&fit=crop',
    lat: 35.8547,
    lng: 128.6356,
  },
  {
    id: 'sunshine',
    name: '햇살 어린이집',
    district: 'dalseo',
    address: '대구광역시 달서구 월배로 300 (상인동)',
    phone: '053-632-9012',
    capacity: 50,
    current: 43,
    teachers: 13,
    hasBus: true,
    extended: false,
    features: ['영아전담'],
    programs: ['미술 창작 놀이', '요리 활동', '전래놀이'],
    image: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&h=400&fit=crop',
    lat: 35.8294,
    lng: 128.5554,
  },
  {
    id: 'rainbow',
    name: '무지개 어린이집',
    district: 'buk',
    address: '대구광역시 북구 대학로 80 (산격동)',
    phone: '053-951-3456',
    capacity: 40,
    current: 35,
    teachers: 10,
    hasBus: false,
    extended: true,
    features: ['야간연장'],
    programs: ['과학 탐구 놀이', '독서 프로그램', '다문화 이해 교육'],
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop',
    lat: 35.8875,
    lng: 128.6104,
  },
  {
    id: 'little-star',
    name: '작은별 어린이집',
    district: 'dong',
    address: '대구광역시 동구 동대구로 500 (신천동)',
    phone: '053-752-7890',
    capacity: 35,
    current: 30,
    teachers: 9,
    hasBus: true,
    extended: false,
    features: ['영아전담'],
    programs: ['감각 놀이', '야외 체험 활동', '음률 교실'],
    image: 'https://images.unsplash.com/photo-1564429238961-bf8e8a3f5e6b?w=600&h=400&fit=crop',
    lat: 35.8798,
    lng: 128.6286,
  },
  {
    id: 'dongsan',
    name: '동산 어린이집',
    district: 'nam',
    address: '대구광역시 남구 앞산순환로 600 (대명동)',
    phone: '053-654-2345',
    capacity: 55,
    current: 48,
    teachers: 14,
    hasBus: true,
    extended: true,
    features: ['장애통합', '영아전담', '야간연장'],
    programs: ['숲속 생태 교육', '요가 놀이', '미디어 리터러시'],
    image: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=600&h=400&fit=crop',
    lat: 35.8450,
    lng: 128.5850,
  },
  {
    id: 'seo-dream',
    name: '꿈나무 어린이집',
    district: 'seo',
    address: '대구광역시 서구 국채보상로 120 (비산동)',
    phone: '053-573-6789',
    capacity: 30,
    current: 25,
    teachers: 8,
    hasBus: false,
    extended: false,
    features: [],
    programs: ['창의 블록 놀이', '전통 문화 체험'],
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&h=400&fit=crop',
    lat: 35.8720,
    lng: 128.5710,
  },
  {
    id: 'dalseong-pine',
    name: '솔빛 어린이집',
    district: 'dalseong',
    address: '대구광역시 달성군 화원읍 성산로 50',
    phone: '053-614-1111',
    capacity: 42,
    current: 36,
    teachers: 11,
    hasBus: true,
    extended: true,
    features: ['야간연장'],
    programs: ['자연 체험 놀이', '텃밭 가꾸기', '동물 교감'],
    image: 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?w=600&h=400&fit=crop',
    lat: 35.8070,
    lng: 128.5280,
  },
];

export const POSTS = [
  {
    id: 1,
    category: 'notice' as const,
    title: '2024년 대구공공형어린이집 신규 선정 심사 계획 안내',
    date: '2024.05.20',
    views: 1245,
    pinned: true,
    badge: 'important',
  },
  {
    id: 2,
    category: 'notice' as const,
    title: '제 5회 어린이 사생대회 개최 및 접수 안내 (상금 100만원)',
    date: '2024.05.18',
    views: 892,
    pinned: true,
    badge: 'event',
  },
  {
    id: 3,
    category: 'notice' as const,
    title: '보육교직원 하반기 직무교육 일자별 장소 안내',
    date: '2024.05.15',
    views: 451,
    pinned: false,
  },
  {
    id: 4,
    category: 'jobs' as const,
    title: '[수성구] 푸른숲어린이집 보육교사(담임) 채용 공고',
    date: '2024.05.14',
    views: 2104,
    pinned: false,
  },
  {
    id: 5,
    category: 'news' as const,
    title: '영유아 보육법 개정에 따른 시설 안전 점검 가이드라인 배포',
    date: '2024.05.12',
    views: 672,
    pinned: false,
  },
  {
    id: 6,
    category: 'notice' as const,
    title: '여름철 감염병 예방 관리 및 대응 체계 강화 요청',
    date: '2024.05.10',
    views: 328,
    pinned: false,
  },
  {
    id: 7,
    category: 'jobs' as const,
    title: '[달서구] 햇살어린이집 조리사 및 연장반 교사 채용',
    date: '2024.05.08',
    views: 1556,
    pinned: false,
  },
  {
    id: 8,
    category: 'news' as const,
    title: '2024년 하반기 보육료 지원 확대 방안 발표',
    date: '2024.05.06',
    views: 987,
    pinned: false,
  },
];

export type PostCategory = 'all' | 'notice' | 'news' | 'jobs';

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  all: '전체',
  notice: '공지사항',
  news: '보육뉴스',
  jobs: '구인구직',
};

export const CATEGORY_COLORS: Record<string, string> = {
  notice: 'text-primary',
  news: 'text-tertiary',
  jobs: 'text-secondary',
};
