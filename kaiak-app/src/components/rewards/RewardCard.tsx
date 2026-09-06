'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, CheckCircle } from 'lucide-react';

interface RewardCardProps {
  name: string;
  pointsRequired: number;
  imageUrl: string | null;
  unlocked: boolean;
  index: number;
}

export default function RewardCard({
  name,
  pointsRequired,
  imageUrl,
  unlocked,
  index,
}: RewardCardProps) {
  return (
    <motion.div
      className={`reward-card ${unlocked ? 'unlocked' : 'locked'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="reward-card-image-wrapper">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div className="reward-card-placeholder">
            <span>🎁</span>
          </div>
        )}

        {/* Locked overlay */}
        {!unlocked && (
          <div className="reward-card-overlay">
            <Lock size={28} color="rgba(255,255,255,0.6)" />
          </div>
        )}

        {/* Unlocked badge */}
        {unlocked && (
          <motion.div
            className="reward-card-unlocked-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <CheckCircle size={20} color="#4FCBFE" />
          </motion.div>
        )}
      </div>

      <div className="reward-card-info">
        <div className="reward-card-name">{name}</div>
        <div className={`reward-card-points ${unlocked ? 'unlocked' : ''}`}>
          {pointsRequired.toLocaleString('es-AR')} pts
          {unlocked ? (
            <CheckCircle size={14} color="#4FCBFE" />
          ) : (
            <Lock size={12} color="rgba(255,255,255,0.4)" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
