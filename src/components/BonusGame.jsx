import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommentRain from './CommentRain';

export default function BonusGame({ onClose }) {
  const [stage, setStage] = useState('choice'); // 'choice', 'troll', 'spins_dont_decide', 'wheel', 'result'
  const [wheelRotation, setWheelRotation] = useState(0);
  const [result, setResult] = useState(null);

  const handleChoice = (c) => {
    if (c === 'play') {
      setStage('troll');
    } else {
      setStage('spins_dont_decide');
      setTimeout(() => {
        setStage('wheel');
      }, 3000);
    }
  };

  const spinWheel = () => {
    // RIGGED: Always loss
    const isWin = false;
    const lossAngle = 2; // Lands on the 1% Red section (Top is 0, rotate 2 deg)
    const totalRotation = 360 * 10 + lossAngle;
    
    setWheelRotation(totalRotation);
    
    setTimeout(() => {
      setResult('loss');
      setStage('result');
    }, 5000);
  };

  return (
    <div className="bonus-overlay">
      <AnimatePresence mode="wait">
        {stage === 'choice' && (
          <motion.div 
            key="choice"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bonus-modal glass"
          >
            <h2 className="neon-text">БОНУСНАЯ ИГРА!</h2>
            <div className="choice-buttons">
              <button className="bonus-btn play" onClick={() => handleChoice('play')}>ИГРАТЬ БОНУС</button>
              <button className="bonus-btn risk" onClick={() => handleChoice('risk')}>ПРОБИТЬ (РИСК)</button>
            </div>
          </motion.div>
        )}

        {stage === 'troll' && (
          <motion.div 
            key="troll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bonus-modal troll-mode"
            style={{ borderColor: '#ef4444' }}
          >
            <h2 className="neon-text">НУ ТЫ И ЛОХ...</h2>
            <p className="troll-text">Надо было пробивать! А ты как лох, так что у тебя ноль!</p>
            <div className="zero-payout neon-text">$0</div>
            <button className="close-btn" onClick={() => onClose(0)}>ЭХ, Я ЛОХ...</button>
          </motion.div>
        )}

        {stage === 'spins_dont_decide' && (
          <motion.div 
            key="spins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bonus-modal centered"
          >
            <h2 className="neon-text pulse">ТЫ ЖЕ ПОНИМАЕШЬ, СПИНЫ НЕ РЕШАЮТ...</h2>
          </motion.div>
        )}

        {stage === 'wheel' && (
          <motion.div 
            key="wheel"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bonus-modal wheel-container"
          >
            <div className="wheel-pointer">▼</div>
            <motion.div 
              className="mini-wheel rigged-wheel"
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 5, ease: "circOut" }}
            >
              <div className="wheel-segment green-win">99%</div>
              <div className="wheel-segment red-loss">1%</div>
            </motion.div>
            <button className="spin-wheel-btn" onClick={spinWheel} disabled={wheelRotation > 0}>
              КРУТИТЬ (99.9% НА ПУШ!)
            </button>
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bonus-modal result-screen"
          >
            <h2 className="neon-text">НУ ТЫ ЖЕ УПРЯМЫЙ...</h2>
            <p className="troll-text">Надо было забирать! Но ты же Упрямый, так что у тебя НОЛЬ!</p>
            <div className="zero-payout neon-text">$0</div>
            <button className="close-btn" onClick={() => onClose(0)}>ПОНЯЛ, Я УПРЯМЫЙ...</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
