import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Reel({ index, spinning, targetSymbolArray, symbols, isBonusSpin }) {
  const controls = useAnimation();
  const [isAnticipating, setIsAnticipating] = useState(false);
  const [displaySymbols, setDisplaySymbols] = useState(
    [...symbols].sort(() => Math.random() - 0.5).slice(0, 5)
  );

  useEffect(() => {
    if (spinning) {
      startSpin();
      // Only start anticipation after the first two reels have stopped (roughly)
      if (isBonusSpin && index >= 2) {
        const timer = setTimeout(() => {
          setIsAnticipating(true);
        }, 500 + index * 300); // Shorter delay, staggered
        return () => clearTimeout(timer);
      }
    } else {
      // Don't immediately stop anticipating if we are in the slow-stop phase
      if (targetSymbolArray) {
        stopSpin();
      } else {
        setIsAnticipating(false);
      }
    }
  }, [spinning, targetSymbolArray]);

  const startSpin = async () => {
    const spinStrip = [];
    for (let i = 0; i < 15; i++) {
      spinStrip.push(...symbols.sort(() => Math.random() - 0.5));
    }
    setDisplaySymbols(spinStrip);

    await controls.start({
      y: [0, -3000],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    });
  };

  const stopSpin = async () => {
    const fillerTop = [...symbols].sort(() => Math.random() - 0.5).slice(0, 6);
    const fillerBottom = [...symbols].sort(() => Math.random() - 0.5).slice(0, 6);
    setDisplaySymbols([...fillerTop, ...targetSymbolArray, ...fillerBottom]);

    let stopDelay = index * 0.2;
    let stopDuration = 0.5;

    if (isBonusSpin && index >= 2) {
      // Long "Anticipation" spin
      stopDelay = 0.5 + (index - 2) * 1.5;
      stopDuration = 1.0;
    }

    await controls.start({
      y: [-2400, -600],
      transition: {
        duration: stopDuration,
        delay: stopDelay,
        ease: isBonusSpin && index >= 2 ? "linear" : "backOut",
      }
    });

    // Final settle and turn off anticipation
    setIsAnticipating(false);
    controls.set({ y: -600 });
  };

  return (
    <div className={`reel ${isAnticipating ? 'anticipation-reel' : ''}`}>
      <motion.div 
        className="reel-inner"
        animate={controls}
        initial={{ y: 0 }}
      >
        {displaySymbols.map((s, i) => (
          <div key={`${s.id}-${i}`} className="symbol-card" style={{ '--symbol-color': s.color }}>
            {s.image ? (
              <img src={s.image} alt={s.label} className="symbol-img" />
            ) : (
              <span className="symbol-emoji">{s.emoji}</span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
