import React from 'react';
import { motion } from 'framer-motion';

export default function UI({ balance, bet, changeBet, spin, spinning, result, lastWin, onWithdraw }) {
  return (
    <div className="ui-container refined-layout">
      <div className="ui-top-row">
        <div className="stats-grid glass">
          <div className="stat">
            <span className="label">BALANCE</span>
            <span className="value neon-text">${balance}</span>
          </div>
          <div className="stat win-display">
            <span className="label">WIN</span>
            <span className="value win-value neon-text">{lastWin > 0 ? `$${lastWin}` : '-'}</span>
          </div>
        </div>

        <div className="center-controls">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`square-spin-btn ${spinning || balance < bet ? 'disabled' : ''}`}
            onClick={spin}
            disabled={spinning || balance < bet}
          >
            {spinning ? '...' : 'SPIN'}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="withdraw-btn glass neon-border"
            onClick={onWithdraw}
          >
            ВЫВОД 💰
          </motion.button>
        </div>

        <div className="bet-controls glass">
          <label className="label">BET</label>
          <div className="bet-buttons">
            <button onClick={() => changeBet(-10)} disabled={spinning}>-10</button>
            <span className="bet-value neon-text">${bet}</span>
            <button onClick={() => changeBet(10)} disabled={spinning}>+10</button>
          </div>
        </div>
      </div>
    </div>
  );
}
