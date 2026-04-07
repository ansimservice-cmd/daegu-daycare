import { useParams, Link } from 'react-router-dom';
import { DAYCARES, DISTRICTS } from '../data/daycares';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const daycare = DAYCARES.find((d) => d.id === id);

  if (!daycare) {
    return (
      <div className="text-center py-40">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">error</span>
        <p className="text-on-surface-variant text-lg mb-4">어린이집 정보를 찾을 수 없습니다.</p>
        <Link to="/search" className="text-primary font-semibold hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const district = DISTRICTS.find((d) => d.id === daycare.district);

  const staffBreakdown = [
    { label: '원장', count: 1 },
    { label: '보육교사', count: daycare.teachers - 3 },
    { label: '조리원', count: 1 },
    { label: '기타 종사자', count: 1 },
  ];

  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <img
          src={daycare.image}
          alt={daycare.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="inline-flex items-center px-3 py-1 bg-primary/90 rounded-full text-xs font-bold mb-4 backdrop-blur-md">
            대구광역시 {district?.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{daycare.name}</h1>
          <p className="text-white/80 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">workspace_premium</span>
            보건복지부 지정 공공형 어린이집
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-8 space-y-8">
          {/* Status Bento */}
          <div className="bg-surface-lowest p-8 rounded-xl shadow-ambient grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'groups', label: '정원/현원', value: `${daycare.capacity} / ${daycare.current}명`, color: 'text-primary' },
              { icon: 'school', label: '교직원수', value: `${daycare.teachers}명`, color: 'text-secondary' },
              { icon: 'directions_bus', label: '통학버스', value: daycare.hasBus ? '운영중' : '미운영', color: 'text-tertiary' },
              { icon: 'timer', label: '연장형', value: daycare.extended ? '가능' : '해당없음', color: 'text-primary' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center p-4 bg-surface-low rounded-lg">
                <span className={`material-symbols-outlined ${item.color} mb-2`}>{item.icon}</span>
                <span className="text-xs text-on-surface-variant mb-1">{item.label}</span>
                <span className="font-bold text-lg">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Basic Info */}
          <div className="bg-surface-lowest p-8 rounded-xl shadow-ambient space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-1 h-8 bg-primary rounded-full" />
              기본 정보
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/5 rounded-full shrink-0">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface-variant">주소</p>
                  <p className="font-medium text-lg">{daycare.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/5 rounded-full shrink-0">
                  <span className="material-symbols-outlined text-secondary">call</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface-variant">전화번호</p>
                  <p className="font-medium text-lg">{daycare.phone}</p>
                </div>
                <a
                  href={`tel:${daycare.phone}`}
                  className="px-4 py-2 bg-secondary text-white hover:opacity-90 transition-opacity rounded-full text-sm font-bold flex items-center gap-2 shrink-0"
                >
                  <span className="material-symbols-outlined text-sm filled">call</span>
                  전화하기
                </a>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-surface-lowest p-8 rounded-xl shadow-ambient space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-1 h-8 bg-primary rounded-full" />
              오시는 길
            </h2>
            <div className="w-full h-80 rounded-lg overflow-hidden bg-surface-highest relative flex items-center justify-center">
              <div className="flex flex-col items-center text-on-surface-variant gap-4">
                <span className="material-symbols-outlined text-5xl">map</span>
                <p className="font-medium">지도 데이터를 불러오는 중입니다...</p>
                <p className="text-sm text-outline">{daycare.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-4 space-y-8">
          {/* Programs */}
          <div className="bg-primary text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">특별 활동 프로그램</h3>
              <ul className="space-y-4">
                {daycare.programs.map((prog, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="material-symbols-outlined bg-white/20 p-1 rounded text-sm">
                      {['psychology', 'forest', 'translate', 'palette', 'sports_soccer'][i % 5]}
                    </span>
                    <span className="text-sm font-medium">{prog}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[160px]">child_care</span>
            </div>
          </div>

          {/* Staff */}
          <div className="bg-surface-low p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-on-surface">교직원 구성</h3>
            <div className="space-y-3">
              {staffBreakdown.map((s) => (
                <div key={s.label} className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">{s.label}</span>
                  <span className="font-bold">{s.count}명</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {daycare.features.length > 0 && (
            <div className="bg-surface-lowest p-6 rounded-xl ghost-border space-y-3">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified</span>
                시설 특성
              </h3>
              <div className="flex flex-wrap gap-2">
                {daycare.features.map((f) => (
                  <span key={f} className="px-3 py-1.5 bg-secondary-container text-on-secondary-container text-sm font-medium rounded-full">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-tertiary-fixed/30 p-6 rounded-xl ghost-border space-y-4">
            <h3 className="font-bold text-tertiary flex items-center gap-2">
              <span className="material-symbols-outlined">edit_note</span>
              입소 상담 신청
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {daycare.name}의 입소 및 대기 상담을 원하시면 아래 버튼을 눌러주세요.
            </p>
            <button className="w-full py-4 bg-tertiary text-white font-bold rounded-full hover:opacity-90 transition-all active:scale-95 shadow-md">
              상담 예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
