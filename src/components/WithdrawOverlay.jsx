import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WithdrawOverlay({ show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="withdraw-overlay glass neon-border"
        >
          <h2 className="toxic-text neon-text">Какой вывод Сначало Додеп но Если хочет То ВЫВОД ДАЛБАЁБ</h2>
          <div className="troll-emoji">🤫🤡💸</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
