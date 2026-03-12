import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CommentRain = forwardRef((props, ref) => {
  const [items, setItems] = useState([]);

  const drop = (text) => {
    const newItem = {
      id: Math.random(),
      text,
      left: (5 + Math.random() * 80) + '%',
      depth: Math.random() * 20,
      duration: 3 + Math.random() * 2
    };
    setItems(prev => [...prev.slice(-40), newItem]);
  };

  useImperativeHandle(ref, () => ({
    drop,
    burst(messages, count = 8) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          drop(messages[Math.floor(Math.random() * messages.length)]);
        }, i * (100 + Math.random() * 100));
      }
    }
  }));

  return (
    <div className="comment-rain-container">
      <AnimatePresence mode="popLayout">
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ y: -100, opacity: 0, scale: 0.5, x: 0 }}
            animate={{ 
              y: 800, 
              opacity: 1, 
              scale: 1,
              x: (Math.random() - 0.5) * 50
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: item.duration, ease: "linear" }}
            className="chat-comment"
            style={{ 
              left: item.left,
              zIndex: 3000 + Math.floor(item.depth),
              fontSize: `${0.9 + item.depth/40}rem`,
              opacity: 0.8 + item.depth/50,
              filter: `drop-shadow(0 0 10px var(--primary))`
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default CommentRain;
