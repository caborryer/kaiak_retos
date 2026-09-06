'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  totalKm: number;
  goalKm?: number;
}

export default function ProgressRing({ totalKm, goalKm = 21 }: ProgressRingProps) {
  const [animated, setAnimated] = useState(false);

  const size = 300;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(totalKm / goalKm, 1);
  const dashOffset = circumference * (1 - progress);

  // Angle for the dot at end of arc
  const angle = (-90 + 360 * progress) * (Math.PI / 180);
  const dotX = size / 2 + radius * Math.cos(angle);
  const dotY = size / 2 + radius * Math.sin(angle);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="progress-ring-container">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="progress-ring-svg"
        aria-label={`${totalKm} km de ${goalKm} km acumulados`}
      >
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FCBFE" />
            <stop offset="50%" stopColor="#3797E1" />
            <stop offset="100%" stopColor="#4FCBFE" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowDot" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer decorative ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 12}
          fill="none"
          stroke="rgba(30,48,80,0.5)"
          strokeWidth={1}
          strokeDasharray="4 8"
        />

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E3050"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: animated ? dashOffset : circumference }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#glow)"
        />

        {/* Dot at tip of arc */}
        {progress > 0.01 && (
          <motion.circle
            cx={dotX}
            cy={dotY}
            r={9}
            fill="#4FCBFE"
            filter="url(#glowDot)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: animated ? 1 : 0, scale: animated ? 1 : 0 }}
            transition={{ delay: 1.8, duration: 0.3 }}
          />
        )}
      </svg>

      {/* Center text overlay */}
      <div className="progress-ring-center">
        <span className="progress-ring-label">TOTAL ACUMULADO</span>
        <motion.span
          className="progress-ring-value"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {totalKm.toLocaleString('es-AR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
        </motion.span>
        <span className="progress-ring-unit">KM</span>
      </div>
    </div>
  );
}
