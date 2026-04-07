import { Link } from 'react-router-dom';
import type { Daycare } from '../data/daycares';
import { DISTRICTS } from '../data/daycares';

export default function DaycareCard({ daycare }: { daycare: Daycare }) {
  const district = DISTRICTS.find((d) => d.id === daycare.district);

  return (
    <Link
      to={`/daycare/${daycare.id}`}
      className="group bg-surface-lowest rounded-xl overflow-hidden shadow-ambient hover:shadow-lg transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={daycare.image}
          alt={daycare.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">
            {district?.name}
          </span>
          {daycare.features.map((f) => (
            <span key={f} className="px-2 py-1 bg-white/80 text-on-surface text-xs font-medium rounded-full backdrop-blur-md">
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
          {daycare.name}
        </h3>
        <p className="text-sm text-on-surface-variant truncate">{daycare.address}</p>
        <div className="flex items-center gap-4 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-primary">groups</span>
            {daycare.current}/{daycare.capacity}명
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-secondary">school</span>
            교사 {daycare.teachers}명
          </span>
          {daycare.hasBus && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-tertiary">directions_bus</span>
              통학버스
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
