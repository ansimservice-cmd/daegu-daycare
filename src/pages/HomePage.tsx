import { Link } from 'react-router-dom';
import DistrictMap from '../components/DistrictMap';
import DaycareCard from '../components/DaycareCard';
import { POSTS, useDaycares } from '../data/daycares';

export default function HomePage() {
  const { daycares, loading } = useDaycares();
  const recentDaycares = daycares.slice(0, 4);
  const recentPosts = POSTS.filter((p) => !p.pinned).slice(0, 3);
  const totalCount = daycares.length;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-primary min-h-[480px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-secondary/30 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-flex items-center px-4 py-2 bg-white/15 rounded-full text-white/90 text-sm font-medium backdrop-blur-md mb-6">
            <span className="material-symbols-outlined text-sm mr-2">workspace_premium</span>
            보건복지부 지정 공공형 어린이집
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            우리 아이를 위한<br />
            <span className="text-primary-fixed">최고의 보육 환경</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            대구시 {totalCount}개 공공형 어린이집의 정보를 투명하게 공개합니다.
            가까운 어린이집을 찾아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="btn-gradient text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <span className="flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined">search</span>
                어린이집 찾기
              </span>
            </Link>
            <Link
              to="/about"
              className="bg-white/15 text-white px-8 py-4 rounded-full font-bold text-lg backdrop-blur-md hover:bg-white/25 transition-all active:scale-95"
            >
              연합회 소개
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-surface-lowest rounded-2xl shadow-ambient p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'apartment', label: '소속 어린이집', value: `${totalCount}개소`, color: 'text-primary' },
            { icon: 'groups', label: '보육 아동', value: '3,200+명', color: 'text-secondary' },
            { icon: 'school', label: '보육 교직원', value: '800+명', color: 'text-tertiary' },
            { icon: 'location_city', label: '대구시 전역', value: '9개 구/군', color: 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className={`material-symbols-outlined text-3xl ${stat.color} mb-2`}>{stat.icon}</span>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-sm text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* District Map */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
            District Search
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-4">
            구별 어린이집 찾기
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            대구시 9개 구/군의 공공형 어린이집을 지도에서 클릭하여 찾아보세요.
          </p>
        </div>
        <DistrictMap />
      </section>

      {/* Recent Daycares */}
      <section className="bg-surface-low py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
                Featured
              </span>
              <h2 className="text-3xl font-extrabold text-on-surface">추천 어린이집</h2>
            </div>
            <Link to="/search" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
              전체보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 bg-surface-container rounded-xl animate-pulse"
                />
              ))
            ) : recentDaycares.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-on-surface-variant">
                  등록된 어린이집이 아직 없습니다.
                </p>
              </div>
            ) : (
              recentDaycares.map((dc) => (
                <DaycareCard key={dc.id} daycare={dc} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
              Announcement
            </span>
            <h2 className="text-3xl font-extrabold text-on-surface">최근 공지사항</h2>
          </div>
          <Link to="/board" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
            전체보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient">
          {recentPosts.map((post, i) => (
            <div
              key={post.id}
              className={`group px-6 py-5 flex items-center justify-between hover:bg-surface-low transition-colors cursor-pointer ${
                i < recentPosts.length - 1 ? 'ghost-border border-x-0 border-t-0' : ''
              }`}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase ${
                    post.category === 'notice' ? 'text-primary' : post.category === 'news' ? 'text-tertiary' : 'text-secondary'
                  }`}>
                    {post.category === 'notice' ? '공지사항' : post.category === 'news' ? '보육뉴스' : '구인구직'}
                  </span>
                  <span className="text-xs text-outline">{post.date}</span>
                </div>
                <h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
              </div>
              <span className="flex items-center text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                {post.views.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            우리 아이에게 맞는 어린이집을 찾아보세요
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            대구시 공공형 어린이집은 보건복지부의 엄격한 기준을 통과한<br className="hidden md:block" />
            안전하고 신뢰할 수 있는 보육 기관입니다.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">search</span>
            어린이집 찾기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-inverse-surface text-inverse-on-surface py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">대구공공형어린이집연합회</h3>
              <p className="text-sm opacity-70 leading-relaxed">
                대구광역시 공공형 어린이집의 발전과<br />
                영유아 보육 환경 개선을 위해 노력합니다.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">바로가기</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><Link to="/about" className="hover:opacity-100 transition-opacity">연합회 소개</Link></li>
                <li><Link to="/search" className="hover:opacity-100 transition-opacity">어린이집 찾기</Link></li>
                <li><Link to="/board" className="hover:opacity-100 transition-opacity">알림마당</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">연락처</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">call</span>
                  053-000-0000
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">mail</span>
                  info@daegu-daycare.or.kr
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  대구광역시 중구 동성로
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm opacity-50">
            &copy; 2024 대구공공형어린이집연합회. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
