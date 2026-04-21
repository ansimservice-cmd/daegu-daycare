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

## 🔗 원천 데이터: cc.genomic.cc (genomic-platform)

**경로**: `C:\Users\admin\genomic-platform` | **GitHub**: `ansimservice-cmd/genomic-platform`

### 관계 (이 프로젝트는 읽기 전용 프론트)
```
cc.genomic.cc [genomic-platform]  ← 데이터 원천 (D1 centers, 관리자 UI, API)
                ↓ /api/centers (fetch)
00.genomic.cc [이 프로젝트]        ← 읽기 전용, 관리자 페이지 없음
```

### ⚠️ 이 프로젝트에는 관리자 UI 없음
- 시설 정보 추가·수정·삭제는 **항상 cc.genomic.cc/admin**에서
- 00.genomic.cc에 시설을 노출시키려면 cc 관리자에서 `is_federation_member` 체크박스 ON
- 여기 저장소에서 시설 데이터 수정 시도 금지 (정적 배열 아님, API 읽기 전용)

### 대표님 지시어 해석 규칙
| 지시 | 실제 작업 |
|------|---------|
| "00에 어린이집 추가" | **cc.genomic.cc/admin** 작업 |
| "00에서 OO 제외" | **cc.genomic.cc/admin**에서 `is_federation_member` 체크 해제 |
| "00 디자인/레이아웃 바꿔" | **이 프로젝트** (daegu-daycare) |
| "00에 게시판 추가" | **이 프로젝트** (현재 정적 POSTS 배열 `src/data/daycares.ts`) |

### 디렉토리 노출 필터 (`src/data/centersApi.ts`)
```ts
.filter(c => c.category === "daycare" && c.district && c.isFederationMember === true)
```
cc.genomic.cc API 응답에서 위 3조건 전부 만족하는 시설만 노출.

### 🚨 배포 지뢰 (2026-04-21 세션에서 2번 넘어짐)

**Cloudflare Pages Production branch = `main`, git 로컬 = `master`**

기본 `wrangler pages deploy dist --project-name=daegu-daycare` 은 브랜치명(`master`)을 자동 인식해 **Preview 환경**으로만 올라감. `00.genomic.cc` 실도메인은 여전히 옛날 번들 서빙.

**올바른 배포 명령**:
```bash
cd /c/Users/admin/daegu-daycare
npm run build
npx wrangler pages deploy dist --project-name=daegu-daycare \
  --branch=main --commit-dirty=true --commit-message="english only"
```

- `--branch=main` **필수** (Production 반영)
- `--commit-message`는 **반드시 영문** (한글 시 Cloudflare API 400 에러)
- 배포 후 번들 반영 검증:
  ```bash
  curl -s https://00.genomic.cc/ | grep -oE "assets/index-[A-Za-z0-9_-]+\.js"
  ls dist/assets/ | grep "^index-.*\.js"
  # 둘의 해시가 같아야 정상
  ```

### cc.genomic.cc API 응답 타입 변경 시
`CenterApiRow` (`src/data/centersApi.ts`) 타입을 cc 응답 필드와 동기화. cc가 새 필드 추가 시 이 타입도 확장 필수 (안 그러면 TypeScript 컴파일 에러 or 런타임 undefined).

### 현재 이 프로젝트 안에 정적으로 남아있는 것
- `src/data/daycares.ts`의 `POSTS` 배열 (알림마당/게시판 — 추후 cc로 이관 예정)
- `DISTRICTS` 메타데이터 (대구 9개 구군 목록)
- 그 외 어린이집 데이터는 **centersApi.ts에서 re-export** (cc API 경유)

## 배포 명령어 (정식)
```bash
cd /c/Users/admin/daegu-daycare
npm run build
npx wrangler pages deploy dist --project-name=daegu-daycare \
  --branch=main --commit-dirty=true --commit-message="short english summary"
```

## 향후 확장 (미구현)
- 카카오/네이버 지도 API 연동 (현재 placeholder)
- POSTS(알림마당) cc.genomic.cc로 이관
- 엑셀 일괄 업로드 (cc 관리자 측에 만들 예정)
- 회원 로그인/인증 (필요 시 cc.genomic.cc SSO 경유)
- 구별 지회장 권한 관리 (cc 관리자 측)
