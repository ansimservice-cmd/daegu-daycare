import { useState, useMemo } from 'react';
import { POSTS, CATEGORY_LABELS, type PostCategory } from '../data/daycares';

export default function BoardPage() {
  const [category, setCategory] = useState<PostCategory>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = useMemo(() => {
    return POSTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (query && !p.title.includes(query)) return false;
      return true;
    });
  }, [category, query]);

  const pinned = filtered.filter((p) => p.pinned);
  const regular = filtered.filter((p) => !p.pinned);
  const totalPages = Math.max(1, Math.ceil(regular.length / perPage));
  const paged = regular.slice((page - 1) * perPage, page * perPage);

  const categoryColor = (cat: string) => {
    if (cat === 'notice') return 'text-primary';
    if (cat === 'news') return 'text-tertiary';
    return 'text-secondary';
  };

  const categoryLabel = (cat: string) => {
    if (cat === 'notice') return '공지사항';
    if (cat === 'news') return '보육뉴스';
    return '구인구직';
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 pb-12">
      {/* Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
              Announcement Center
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight">
              알림마당
            </h2>
            <p className="text-on-surface-variant mt-4 max-w-lg leading-relaxed">
              대구공공형어린이집의 최신 소식과 공지사항, 구인구직 정보를 한눈에 확인하세요.
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">search</span>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="검색어를 입력하세요"
              className="w-full pl-12 pr-4 py-4 bg-surface-highest border-none rounded-full focus:ring-2 focus:ring-primary/20 placeholder:text-outline text-on-surface transition-all outline-none"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="mb-10 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max pb-2">
          {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map((key) => (
            <button
              key={key}
              onClick={() => { setCategory(key); setPage(1); }}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                category === key
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-low text-on-surface-variant hover:bg-surface-high'
              }`}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinned.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {pinned.map((post) => (
            <div
              key={post.id}
              className={`p-6 rounded-xl relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all ${
                post.badge === 'event' ? 'bg-secondary-container' : 'bg-primary-fixed'
              }`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[80px]">
                  {post.badge === 'event' ? 'celebration' : 'campaign'}
                </span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                post.badge === 'event'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary text-on-primary'
              }`}>
                <span className="material-symbols-outlined text-xs mr-1 filled">push_pin</span>
                {post.badge === 'event' ? '이벤트' : '중요공지'}
              </span>
              <h3 className="text-xl font-bold mb-3">{post.title}</h3>
              <div className="flex items-center text-sm gap-4 opacity-70">
                <span>{post.date}</span>
                <span className="flex items-center">
                  <span className="material-symbols-outlined text-xs mr-1">visibility</span>
                  {post.views.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post List */}
      <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-ambient">
        {paged.length > 0 ? (
          paged.map((post, i) => (
            <div
              key={post.id}
              className={`group px-6 py-5 flex items-center justify-between hover:bg-surface-low transition-colors cursor-pointer ${
                i < paged.length - 1 ? 'ghost-border border-x-0 border-t-0' : ''
              }`}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase ${categoryColor(post.category)}`}>
                    {categoryLabel(post.category)}
                  </span>
                  <span className="text-xs text-outline">&#183;</span>
                  <span className="text-xs text-outline">{post.date}</span>
                </div>
                <h4 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
              </div>
              <div className="flex items-center text-on-surface-variant text-sm tabular-nums whitespace-nowrap">
                <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                {post.views.toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
            <p>해당 카테고리의 게시글이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="mt-12 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full hover:bg-surface-high transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-outline">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-colors ${
                p === page
                  ? 'bg-primary text-on-primary'
                  : 'hover:bg-surface-high'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full hover:bg-surface-high transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </button>
        </section>
      )}
    </div>
  );
}
