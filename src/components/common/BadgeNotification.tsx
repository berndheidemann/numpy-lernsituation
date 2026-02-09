import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProgressStore } from '../../store/progressStore'
import { BADGE_DEFINITIONS } from '../../data/badges'

export default function BadgeNotification() {
  const badges = useProgressStore((s) => s.badges)
  const prevCountRef = useRef(badges.length)
  const [notification, setNotification] = useState<{ icon: string; title: string } | null>(null)

  useEffect(() => {
    if (badges.length > prevCountRef.current) {
      const newBadgeId = badges[badges.length - 1]
      const def = BADGE_DEFINITIONS.find((b) => b.id === newBadgeId)
      if (def) {
        setNotification({ icon: def.icon, title: def.title })
        const timer = setTimeout(() => setNotification(null), 4000)
        return () => clearTimeout(timer)
      }
    }
    prevCountRef.current = badges.length
  }, [badges])

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white border border-amber-300 shadow-lg rounded-xl px-5 py-3"
          role="status"
          aria-live="polite"
          data-testid="badge-notification"
        >
          <span className="text-3xl" aria-hidden="true">{notification.icon}</span>
          <div>
            <p className="text-xs text-amber-600 font-medium">Neues Badge!</p>
            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
