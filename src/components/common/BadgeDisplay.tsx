import { useProgressStore } from '../../store/progressStore'
import { BADGE_DEFINITIONS } from '../../data/badges'

export default function BadgeDisplay() {
  const badges = useProgressStore((s) => s.badges)

  return (
    <div data-testid="badge-display">
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Badges</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {BADGE_DEFINITIONS.map((badge) => {
          const earned = badges.includes(badge.id)
          return (
            <div
              key={badge.id}
              className={`rounded-lg border p-3 text-center transition-colors ${
                earned
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-slate-200 bg-slate-50 opacity-50'
              }`}
              data-testid={`badge-${badge.id}`}
            >
              <div className="text-2xl mb-1" aria-hidden="true">
                {earned ? badge.icon : '🔒'}
              </div>
              <p className="text-xs font-medium text-slate-800">{badge.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
