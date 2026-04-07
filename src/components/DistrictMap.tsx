import { useNavigate } from 'react-router-dom';
import { DISTRICTS } from '../data/daycares';

const DISTRICT_POSITIONS: Record<string, { x: number; y: number }> = {
  buk: { x: 50, y: 18 },
  dong: { x: 72, y: 35 },
  jung: { x: 48, y: 40 },
  seo: { x: 30, y: 42 },
  nam: { x: 48, y: 58 },
  suseong: { x: 68, y: 52 },
  dalseo: { x: 28, y: 60 },
  dalseong: { x: 20, y: 78 },
  gunwi: { x: 80, y: 12 },
};

export default function DistrictMap() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      {/* Background circle */}
      <div className="absolute inset-4 rounded-full bg-primary-fixed/30" />
      <div className="absolute inset-12 rounded-full bg-primary-fixed/20" />

      {DISTRICTS.map((district) => {
        const pos = DISTRICT_POSITIONS[district.id];
        return (
          <button
            key={district.id}
            onClick={() => navigate(`/search?district=${district.id}`)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-ambient flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110">
                <span className="text-sm md:text-base font-bold text-primary group-hover:text-white">
                  {district.count}
                </span>
              </div>
              <span className="text-xs md:text-sm font-semibold text-on-surface whitespace-nowrap">
                {district.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
