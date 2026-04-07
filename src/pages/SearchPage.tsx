import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DaycareCard from '../components/DaycareCard';
import { DAYCARES, DISTRICTS } from '../data/daycares';

const FEATURES = ['영아전담', '장애통합', '야간연장'] as const;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDistrict = searchParams.get('district') || 'all';

  const [district, setDistrict] = useState<string>(initialDistrict);
  const [query, setQuery] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return DAYCARES.filter((dc) => {
      if (district !== 'all' && dc.district !== district) return false;
      if (query && !dc.name.includes(query) && !dc.address.includes(query)) return false;
      if (selectedFeatures.size > 0) {
        for (const f of selectedFeatures) {
          if (!dc.features.includes(f)) return false;
        }
      }
      return true;
    });
  }, [district, query, selectedFeatures]);

  const handleDistrictChange = (id: string) => {
    setDistrict(id);
    if (id === 'all') {
      searchParams.delete('district');
    } else {
      searchParams.set('district', id);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const toggleFeature = (f: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 pb-12">
      {/* Header */}
      <section className="mb-10">
        <span className="text-primary font-bold tracking-widest text-sm uppercase mb-2 block">
          Find Daycare
        </span>
        <h2 className="text-4xl font-extrabold text-on-surface mb-4">어린이집 찾기</h2>
        <p className="text-on-surface-variant max-w-lg leading-relaxed">
          행정구역별, 특성별로 대구시 공공형 어린이집을 검색하세요.
        </p>
      </section>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline">search</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="어린이집 이름 또는 주소 검색"
          className="w-full pl-12 pr-4 py-4 bg-surface-highest border-none rounded-full focus:ring-2 focus:ring-primary/20 placeholder:text-outline text-on-surface transition-all outline-none"
        />
      </div>

      {/* District Tabs */}
      <div className="overflow-x-auto no-scrollbar mb-4">
        <div className="flex gap-2 min-w-max pb-2">
          <button
            onClick={() => handleDistrictChange('all')}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              district === 'all'
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                : 'bg-surface-low text-on-surface-variant hover:bg-surface-high'
            }`}
          >
            전체
          </button>
          {DISTRICTS.map((d) => (
            <button
              key={d.id}
              onClick={() => handleDistrictChange(d.id)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                district === d.id
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-low text-on-surface-variant hover:bg-surface-high'
              }`}
            >
              {d.name} ({d.count})
            </button>
          ))}
        </div>
      </div>

      {/* Feature Filters */}
      <div className="flex gap-2 mb-8">
        {FEATURES.map((f) => (
          <button
            key={f}
            onClick={() => toggleFeature(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ghost-border ${
              selectedFeatures.has(f)
                ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
                : 'bg-surface-lowest text-on-surface-variant hover:bg-surface-low'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-on-surface-variant">
        검색 결과 <span className="font-bold text-primary">{filtered.length}</span>건
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((dc) => (
            <DaycareCard key={dc.id} daycare={dc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
          <p className="text-on-surface-variant text-lg">검색 조건에 맞는 어린이집이 없습니다.</p>
          <button
            onClick={() => { setDistrict('all'); setQuery(''); setSelectedFeatures(new Set()); }}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
