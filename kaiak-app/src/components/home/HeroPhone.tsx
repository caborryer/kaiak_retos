'use client';

import { motion } from 'framer-motion';
import '@/styles/home.css';

export default function HeroPhone() {
  return (
    <div className="hero-phone-wrapper">
      <motion.div
        className="hero-phone"
        animate={{
          rotateY: [0, 8, 0, -8, 0],
          rotateX: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Phone Frame */}
        <div className="hero-phone-screen">
          <div className="hero-phone-notch" />
          <div className="hero-phone-content">
            <div className="hero-phone-logo">
              <span>KAIAK</span>
              <span className="hero-phone-logo-k21"> K21</span>
            </div>
            <div className="hero-phone-bottle">
              <motion.div
                className="hero-phone-bottle-inner"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <p className="hero-phone-text">
              ACTIVÁ<br />TU MOMENTO<br />
              <span className="hero-phone-text-accent">21K</span>
            </p>
            <p className="hero-phone-subtext">
              Tu cuerpo se mueve.<br />
              Tu fragancia responde.
            </p>
            <button className="hero-phone-cta">SUMÁ TUS KM</button>
          </div>
        </div>

        {/* Glow effect */}
        <div className="hero-phone-glow" />

        {/* Side reflections */}
        <motion.div
          className="hero-phone-reflection"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}
