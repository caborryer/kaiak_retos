'use client';

import { motion } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';
import { getUserLevel } from '@/types';

interface PointsPanelProps {
  totalPoints: number;
}

export default function PointsPanel({ totalPoints }: PointsPanelProps) {
  const { level, nextLevel, pointsToNext } = getUserLevel(totalPoints);

  return (
    <div className="points-panel">
      <div className="points-panel-left">
        <div className="points-panel-label">TUS PUNTOS</div>
        <motion.div
          className="points-panel-value"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {totalPoints.toLocaleString('es-AR')}
          <span className="points-panel-pts"> PTS</span>
        </motion.div>
        <button className="btn-secondary points-panel-btn">
          <Clock size={14} />
          VER HISTORIAL
        </button>
      </div>

      <div className="points-panel-right">
        <div className="points-panel-level-label">NIVEL ACTUAL</div>
        <div className="points-panel-level">
          <Trophy size={20} color="#3797E1" />
          {level}
        </div>
        {nextLevel && pointsToNext && (
          <div className="points-panel-next">
            {pointsToNext.toLocaleString('es-AR')} PTS PARA LLEGAR A {nextLevel}
          </div>
        )}
        {!nextLevel && (
          <div className="points-panel-next reached">
            ¡NIVEL MÁXIMO ALCANZADO! 🏆
          </div>
        )}
      </div>
    </div>
  );
}
