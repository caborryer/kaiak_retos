'use client';

import { motion } from 'framer-motion';
import { Check, Share2, Activity } from 'lucide-react';

interface ChallengeCardProps {
  name: string;
  description: string | null;
  distanceKm: number | null;
  points: number;
  icon: string;
  completed: boolean;
  index: number;
}

function ChallengeIcon({ icon, completed }: { icon: string; completed: boolean }) {
  const color = completed ? '#4FCBFE' : 'rgba(255,255,255,0.4)';
  if (icon === 'share') return <Share2 size={32} color={color} />;
  return <Activity size={32} color={color} />;
}

export default function ChallengeCard({
  name,
  description,
  distanceKm,
  points,
  icon,
  completed,
  index,
}: ChallengeCardProps) {
  return (
    <motion.div
      className={`challenge-card ${completed ? 'completed' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="challenge-card-icon">
        <ChallengeIcon icon={icon} completed={completed} />
      </div>

      <div className="challenge-card-name">{name}</div>

      {description && (
        <div className="challenge-card-desc">{description}</div>
      )}

      {distanceKm && (
        <div className="challenge-card-distance">
          {distanceKm}K
        </div>
      )}

      <div className="challenge-card-points">+{points} pts</div>

      <div className={`challenge-card-check ${completed ? 'visible' : ''}`}>
        <Check size={16} />
      </div>
    </motion.div>
  );
}
