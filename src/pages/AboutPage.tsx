import { Link } from 'react-router-dom';
import { DISTRICTS } from '../data/daycares';

const ORG_CHART = [
  { title: '회장', name: '홍길동', role: '연합회 총괄' },
  { title: '부회장', name: '김보육', role: '대외 협력' },
  { title: '감사', name: '이감사', role: '회계 감사' },
  { title: '사무국장', name: '박사무', role: '사무국 운영' },
];

const TIMELINE = [
  { year: '2010', event: '대구공공형어린이집연합회 설립' },
  { year: '2013', event: '회원 어린이집 50개소 돌파' },
  { year: '2016', event: '보건복지부 우수 연합회 표창' },
  { year: '2019', event: '공공형 어린이집 100개소 달성' },
  { year: '2022', event: '디지털 전환 프로젝트 시작' },
  { year: '2024', event: '연합회 홈페이지 리뉴얼 오픈' },
];

export default function AboutPage() {
  const totalCount = DISTRICTS.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-container py-20 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <span className="text-white/70 font-bold tracking-widest text-sm uppercase mb-4 block">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            대구공공형어린이집연합회
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            대구광역시 {totalCount}개 공공형 어린이집이 함께하는 연합회입니다.<br />
            영유아의 건강한 성장과 안전한 보육 환경을 위해 노력합니다.
          </p>
        </div>
      </section>

      {/* Greeting */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2">
            <div className="w-full aspect-[3/4] bg-surface-low rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-8xl text-outline/30">person</span>
            </div>
          </div>
          <div className="md:col-span-3">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
              Greeting
            </span>
            <h2 className="text-3xl font-extrabold text-on-surface mb-6">회장 인사말</h2>
            <div className="space-y-4 text-on-surface-variant leading-relaxed">
              <p>
                안녕하십니까. 대구공공형어린이집연합회 회장입니다.
              </p>
              <p>
                우리 연합회는 대구광역시 영유아들의 건강한 성장과 발달을 지원하고,
                공공형 어린이집의 보육 품질 향상을 위해 설립되었습니다.
              </p>
              <p>
                보건복지부가 지정한 공공형 어린이집은 운영의 투명성, 보육의 공공성,
                시설의 안전성 등 엄격한 기준을 충족하는 신뢰할 수 있는 보육 기관입니다.
              </p>
              <p>
                앞으로도 학부모님들이 안심하고 자녀를 맡길 수 있는 환경을 만들기 위해
                최선을 다하겠습니다. 감사합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Public Daycare */}
      <section className="bg-surface-low py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
              Public Daycare
            </span>
            <h2 className="text-3xl font-extrabold text-on-surface mb-4">공공형 어린이집이란?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: 'verified_user',
                title: '정부 인증',
                desc: '보건복지부의 엄격한 기준을 통과한 인증 어린이집으로, 운영 투명성과 보육 품질이 보장됩니다.',
              },
              {
                icon: 'account_balance',
                title: '공공성 강화',
                desc: '정부 지원금을 통해 합리적인 보육료로 양질의 서비스를 제공하며, 취약계층 우선 지원합니다.',
              },
              {
                icon: 'shield',
                title: '안전 관리',
                desc: '정기적인 시설 점검과 교직원 교육을 통해 아이들의 안전을 최우선으로 관리합니다.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-surface-lowest p-8 rounded-xl shadow-ambient text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-4">{item.icon}</span>
                <h3 className="text-xl font-bold text-on-surface mb-3">{item.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
            Organization
          </span>
          <h2 className="text-3xl font-extrabold text-on-surface mb-4">조직도</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ORG_CHART.map((member) => (
            <div key={member.title} className="bg-surface-lowest p-6 rounded-xl shadow-ambient text-center">
              <div className="w-16 h-16 rounded-full bg-primary-fixed mx-auto mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">person</span>
              </div>
              <span className="text-xs text-primary font-bold uppercase">{member.title}</span>
              <h4 className="font-bold text-on-surface mt-1">{member.name}</h4>
              <p className="text-xs text-on-surface-variant mt-1">{member.role}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-surface-low p-6 rounded-xl">
          <h4 className="font-bold text-on-surface mb-4 text-center">구별 지회</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {DISTRICTS.map((d) => (
              <div key={d.id} className="bg-surface-lowest p-3 rounded-lg text-center">
                <p className="font-semibold text-sm">{d.name}</p>
                <p className="text-xs text-on-surface-variant">{d.count}개소</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface-low py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
              History
            </span>
            <h2 className="text-3xl font-extrabold text-on-surface mb-4">연혁</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary/20" />
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex items-center mb-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-surface-low z-10" />
                <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                  <div className="bg-surface-lowest p-5 rounded-xl shadow-ambient">
                    <span className="text-secondary font-bold text-sm">{item.year}</span>
                    <p className="text-on-surface font-medium mt-1">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
            Location
          </span>
          <h2 className="text-3xl font-extrabold text-on-surface mb-4">오시는 길</h2>
        </div>
        <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient">
          <div className="h-80 bg-surface-highest flex items-center justify-center">
            <div className="text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-2">map</span>
              <p className="font-medium">지도 영역</p>
              <p className="text-sm text-outline mt-1">대구광역시 중구 동성로</p>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="text-on-surface">대구광역시 중구 동성로 (연합회 사무실)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">call</span>
              <span className="text-on-surface">053-000-0000</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span className="text-on-surface">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">궁금한 점이 있으신가요?</h2>
        <p className="text-white/80 mb-8">연합회에 대해 더 알고 싶으시면 언제든 연락해 주세요.</p>
        <Link
          to="/board"
          className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">forum</span>
          문의하기
        </Link>
      </section>
    </div>
  );
}
