'use client';

import { motion } from 'framer-motion';
import { PersonStanding } from 'lucide-react';

interface MilestoneBarProps {
  totalKm: number;
}

const GOAL_KM = 21;
const MILESTONES = [
  { km: 0, label: '0 KM' },
  { km: 10, label: '10 K' },
  { km: 21, label: '21 K' },
];

export default function MilestoneBar({ totalKm }: MilestoneBarProps) {
  const progressPct = Math.min((totalKm / GOAL_KM) * 100, 100);
  const isComplete = totalKm >= GOAL_KM;

  return (
    <div className="milestone-bar-container">
      {/* Track */}
      <div className="milestone-bar-track">
        {/* Filled portion */}
        <motion.div
          className="milestone-bar-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
        />

        {/* Runner position indicator */}
        <motion.div
          className={`milestone-bar-runner ${isComplete ? 'complete' : ''}`}
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: `${Math.min(progressPct, 96)}%`, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
          title={`${totalKm} km`}
        >
          <PersonStanding size={14} />
        </motion.div>

        {/* Milestone dots */}
        {MILESTONES.filter((m) => m.km > 0 && m.km < GOAL_KM).map((m) => (
          <div
            key={m.km}
            className={`milestone-dot ${totalKm >= m.km ? 'reached' : ''}`}
            style={{ left: `${(m.km / GOAL_KM) * 100}%` }}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="milestone-bar-labels">
        {MILESTONES.map(({ km, label }) => (
          <span
            key={km}
            className={`milestone-label ${totalKm >= km ? 'reached' : ''}`}
            style={{
              left: km === 0 ? '0' : km === GOAL_KM ? 'auto' : `${(km / GOAL_KM) * 100}%`,
              right: km === GOAL_KM ? '0' : 'auto',
              transform: km > 0 && km < GOAL_KM ? 'translateX(-50%)' : 'none',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <p className="milestone-bar-message">
        {isComplete
          ? '🏆 ¡META ALCANZADA! ¡ERES UN FINISHER!'
          : `¡VAMOS POR ESOS 21K!`}
      </p>
    </div>
  );
}
