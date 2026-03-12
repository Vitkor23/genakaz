import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bonusImg from './img/bonus.png';

// Generates random positions for bonus symbol particles
function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 90 + '%',
    size: 40 + Math.random() * 40,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1,
    rotation: Math.random() * 720 - 360,
  }));
}

export default function BonusRain({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles(12));
    } else {
      setParticles([]);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9998,
          overflow: 'hidden',
        }}>
          {particles.map(p => (
            <motion.img
              key={p.id}
              src={bonusImg}
              alt="bonus"
              initial={{ y: -100, opacity: 0, rotate: 0, scale: 0.5, x: 0 }}
              animate={{
                y: window.innerHeight + 100,
                opacity: [0, 1, 1, 0],
                rotate: p.rotation,
                scale: [0.5, 1.2, 1],
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                left: p.left,
                top: 0,
                width: p.size,
                height: p.size,
                objectFit: 'cover',
                borderRadius: '12px',
                border: '3px solid #ffd700',
                boxShadow: '0 0 20px #ffd700, 0 0 40px #9d00ff',
                filter: 'drop-shadow(0 0 15px #ffd700)',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
