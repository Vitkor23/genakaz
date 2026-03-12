import React from 'react';
import Reel from './Reel';

const WIN_LINES_PATH = [
  "M 0 150 L 800 150", // 1: Mid
  "M 0 50 L 800 50",   // 2: Top
  "M 0 250 L 800 250", // 3: Bot
  "M 0 50 L 400 250 L 800 50",   // 4: V
  "M 0 250 L 400 50 L 800 250",  // 5: Inv V
];

export default function SlotMachine({ spinning, result, symbols, winningLines, isBonusSpin }) {
  return (
    <div className="slot-machine-wrapper">
      <div className={`slot-machine glass neon-border ${isBonusSpin && spinning ? 'anticipation-mode' : ''}`}>
        <div className="reels-container five-reels">
          {[0, 1, 2, 3, 4].map((i) => (
            <Reel 
              key={i} 
              index={i} 
              spinning={spinning} 
              targetSymbolArray={result ? result[i] : null}
              symbols={symbols}
              isBonusSpin={isBonusSpin}
            />
          ))}
        </div>
        
        {/* SVG Overlay for Win Lines */}
        <svg className="win-lines-svg" viewBox="0 0 800 300">
          {winningLines.map((lineIdx) => (
            <path 
              key={lineIdx}
              d={WIN_LINES_PATH[lineIdx]} 
              className="win-path"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
