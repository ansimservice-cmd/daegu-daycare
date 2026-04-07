# 대구공공형어린이집연합회 홈페이지

## 프로젝트 개요
- **프로젝트명**: 대구공공형어린이집연합회 공식 웹사이트
- **목적**: 대구시 공공형 어린이집 정보 투명 공개, 구별 검색, 연합회 소통 채널
- **타겟**: 대구시 영유아 학부모, 연합회 소속 원장 및 교사
- **도메인**: 미정 (Cloudflare Pages 배포 예정)

## 기술 스택
- **Frontend**: React 19 + TypeScript + Vite 8
- **스타일**: Tailwind CSS v4 (@tailwindcss/vite)
- **라우팅**: React Router v7
- **배포**: Cloudflare Pages (예정)
- **폰트**: Plus Jakarta Sans (헤드라인) + Pretendard (본문)
- **아이콘**: Material Symbols Outlined (Google Fonts CDN)

## 디자인 시스템: "The Nurturing Atelier"
- **컨셉**: 따뜻함 + 신뢰 + 성장. 전문적이면서 부드러운 UI
- **Primary (#00628d)**: Deep Sky Blue — 신뢰 요소 (헤더, 주요 버튼)
- **Secondary (#006e1c)**: Verdant Growth — 안전/성장 요소
- **Tertiary (#755700)**: Warm Vitality — 강조/기쁨 요소

### 디자인 규칙
- **No-Line Rule**: 1px solid border 금지. 배경색 차이로 영역 구분 (surface → surface-low → surface-lowest)
- **Glassmorphism**: 네비게이션에 80% opacity + 24px backdrop-blur
- **Pill Buttons**: 주요 버튼은 rounded-full (9999px)
- **Frameless Cards**: 카드에 구분선 없이 white space로 분리. rounded-xl (3rem)
- **최소 border-radius**: 0.5rem. 90도 직각 금지
- **텍스트 색상**: 순수 black 금지. on-surface (#171c20) 사용
- **그림자**: 순수 black 금지. on-surface 6% opacity + 32px blur

## 라우트 구조
```
/               → 홈페이지 (히어로 + 통계 + 구별지도 + 추천어린이집 + 공지)
/search         → 어린이집 찾기 (구별 필터 + 특성 필터 + 목록)
/search?district=suseong → 구별 필터 적용
/daycare/:id    → 어린이집 상세 (히어로 + 기본정보 + 지도 + 프로그램)
/board          → 알림마당 (카테고리 탭 + 고정공지 + 목록 + 페이지네이션)
/about          → 연합회 소개 (인사말 + 공공형어린이집이란 + 조직도 + 연혁 + 오시는길)
```

## 파일 구조
```
src/
├── main.tsx            # 엔트리포인트
├── App.tsx             # BrowserRouter + Routes
├── index.css           # Tailwind v4 @theme + 디자인 시스템 CSS
├── components/
│   ├── Layout.tsx      # 공통 레이아웃 (TopAppBar + BottomNav + Outlet)
│   ├── DaycareCard.tsx # 어린이집 카드 컴포넌트
│   └── DistrictMap.tsx # 구별 인터랙티브 맵 (버튼 기반)
├── pages/
│   ├── HomePage.tsx    # 메인 페이지
│   ├── SearchPage.tsx  # 어린이집 찾기
│   ├── DetailPage.tsx  # 어린이집 상세
│   ├── BoardPage.tsx   # 알림마당
│   └── AboutPage.tsx   # 연합회 소개
└── data/
    └── daycares.ts     # 샘플 데이터 (어린이집 8개 + 게시글 8개 + 9개구)
```

## 배포 명령어
```bash
cd /c/Users/admin/daegu-daycare
npm run build
npx wrangler pages deploy dist --project-name=daegu-daycare
```

## 향후 확장 (미구현)
- 카카오/네이버 지도 API 연동 (현재 placeholder)
- 백엔드 API + DB 연동 (현재 정적 데이터)
- 관리자 페이지 (게시판 CRUD, 어린이집 정보 업데이트)
- 엑셀 일괄 업로드
- 회원 로그인/인증
- 구별 지회장 권한 관리
