import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import SlotMachine from './components/SlotMachine';
import UI from './components/UI';
import BonusGame from './components/BonusGame';
import WithdrawOverlay from './components/WithdrawOverlay';
import CommentRain from './components/CommentRain';
import BonusRain from './components/BonusRain';

// Import symbol images
import happyImg from './components/img/happy.jpg';
import laughImg from './components/img/laugh.jpg';
import angryImg from './components/img/angry.jpg';
import donateImg from './components/img/donate.jpg';
import hypeImg from './components/img/hype.jpg';
import jackpotImg from './components/img/jackpot.jpg';
import blessingImg from './components/img/blessing.jpg';
import bonusImg from './components/img/bonus.png';

const SYMBOLS = [
  { id: 'happy', emoji: '🙂', image: happyImg, label: 'Happy', color: '#4ade80', weight: 15 },
  { id: 'laugh', emoji: '😂', image: laughImg, label: 'Laugh', color: '#fbbf24', weight: 12 },
  { id: 'angry', emoji: '😡', image: angryImg, label: 'Angry', color: '#f87171', weight: 8 },
  { id: 'donate', emoji: '💰', image: donateImg, label: 'Donate', color: '#34d399', weight: 5 },
  { id: 'hype', emoji: '🔥', image: hypeImg, label: 'Hype', color: '#fb923c', weight: 4 },
  { id: 'jackpot', emoji: '👑', image: jackpotImg, label: 'Jackpot', color: '#e879f9', weight: 2 },
  { id: 'blessing', emoji: '💎', image: blessingImg, label: '777', color: '#60a5fa', weight: 1 },
  // Bonus symbol should NOT be rolled randomly
  { id: 'bonus', emoji: '🎁', image: bonusImg, label: 'Bonus', color: '#ffffff', weight: 0 },
];

const NVG1_COMMENTS = [
  "Nvg1: ГЕНА НУ ЗАЧЕМ",
  "Nvg1: ГЕНА нет ну Пожалуйста",
  "Nvg1: ГЕНА ННУУУУУУУУУУУУУУУУ",
  "Nvg1: ГЕНА денег и так нету",
  "Nvg1: ГЕНА ЭТО ДООРОГО",
  "Nvg1: ГЕНА слишком ДОРОГО",
  "Nvg1: ГЕНА ГЕНА Гена"
];

const VASILI_COMMENTS = [
  "VasiliEbanansky БЕЙ ЧТО Ты КАК целка",
  "VasiliEbanansky конечно бей ставлю свой зуб",
  "VasiliEbanansky на мужщину бей",
  "VasiliEbanansky жопу ставлю пробаешь"
];

const WIN_LINES = [
  [1, 1, 1, 1, 1], // 1: Middle Row
  [0, 0, 0, 0, 0], // 2: Top Row
  [2, 2, 2, 2, 2], // 3: Bottom Row
  [0, 1, 2, 1, 0], // 4: V-shape
  [2, 1, 0, 1, 2], // 5: Inverse V-shape
];

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null); // Will be 5x3 array
  const [mode, setMode] = useState('normal'); 
  const [showBonus, setShowBonus] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [winningLines, setWinningLines] = useState([]);
  const [spinCount, setSpinCount] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBonusRain, setShowBonusRain] = useState(false);
  const rainRef = useRef(null);

  const changeBet = (delta) => {
    if (spinning) return;
    const newBet = Math.max(10, Math.min(1000, bet + delta));
    if (delta > 0 && newBet > bet) {
      rainRef.current?.burst(NVG1_COMMENTS, 5);
    }
    setBet(newBet);
  };

  const spin = () => {
    if (spinning || balance < bet || showBonus) return;
    
    setBalance(prev => prev - bet);
    setSpinning(true);
    setResult(null);
    setLastWin(0);
    setWinningLines([]);
    setMode('normal');

    const nextSpinCount = spinCount + 1;
    const isBonusSpin = nextSpinCount >= 5;
    setSpinCount(isBonusSpin ? 0 : nextSpinCount);

    // Trigger scatter rain at the start of the bonus spin (anticipation phase)
    if (isBonusSpin) {
      setShowBonusRain(true);
      setTimeout(() => setShowBonusRain(false), 2200); // Keep it for full duration of spin
    }

    const bonusSymbol = SYMBOLS.find(s => s.id === 'bonus');

    setTimeout(() => {
      const newResult = [];
      for (let i = 0; i < 5; i++) {
        const reelSymbols = [
          getRandomSymbol(true), // always exclude bonus for normal symbols
          getRandomSymbol(true),
          getRandomSymbol(true)
        ];

        // On bonus spin, force bonus symbol into the middle row of every reel
        if (isBonusSpin) {
          reelSymbols[1] = bonusSymbol; // middle slot
        }

        newResult.push(reelSymbols);
      }
      setResult(newResult);
      setSpinning(false);

      // On bonus spin, always open the bonus game directly
      if (isBonusSpin) {
        setTimeout(() => {
          setShowBonus(true);
          rainRef.current?.burst(VASILI_COMMENTS, 20);
        }, 600);
      } else {
        checkWin(newResult);
      }
    }, 2000);
  };

  const getRandomSymbol = (excludeBonus = false) => {
    const availableSymbols = excludeBonus 
      ? SYMBOLS.filter(s => s.id !== 'bonus') 
      : SYMBOLS;
    
    const totalWeight = availableSymbols.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of availableSymbols) {
      if (random < symbol.weight) return symbol;
      random -= symbol.weight;
    }
    return availableSymbols[0];
  };

  const checkWin = (grid) => {
    let totalWin = 0;
    let bonusCount = 0;

    // Check bonus symbols (scatters)
    grid.forEach(reel => {
      if (reel.some(s => s.id === 'bonus')) bonusCount++;
    });

    if (bonusCount >= 1) {
      setTimeout(() => {
        setShowBonus(true);
        rainRef.current?.burst(VASILI_COMMENTS, 20);
      }, 500); // Give it a moment after reels stop
      return;
    }

    // Check traditional lines (3+ matching)
    let activeWinLines = [];
    WIN_LINES.forEach((line, lineIdx) => {
      const symbolsOnLine = line.map((rowIdx, colIdx) => grid[colIdx][rowIdx]);
      let matchCount = 1;
      const firstSymbol = symbolsOnLine[0];
      
      if (firstSymbol.id === 'bonus') return; // Bonus doesn't pay on lines

      for (let i = 1; i < symbolsOnLine.length; i++) {
        if (symbolsOnLine[i].id === firstSymbol.id) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        let multiplier = matchCount === 3 ? 2 : matchCount === 4 ? 5 : 20;
        if (firstSymbol.id === 'jackpot') multiplier *= 5;
        if (firstSymbol.id === 'blessing') multiplier *= 10;
        totalWin += bet * multiplier;
        activeWinLines.push(lineIdx);
      }
    });

    if (totalWin > 0) {
      setLastWin(totalWin);
      setWinningLines(activeWinLines);
      setBalance(prev => prev + totalWin);
    }
  };

  return (
    <div className={`app-container ${mode}`}>
      <header>
        <h1 className="neon-text">GeneralQw Slot</h1>
      </header>

      <main>
        <SlotMachine 
          spinning={spinning} 
          result={result} 
          symbols={SYMBOLS} 
          winningLines={winningLines}
          isBonusSpin={spinCount === 4} /* nextSpinCount would be 5 */
        />
        <UI 
          balance={balance} 
          bet={bet}
          changeBet={changeBet}
          spin={spin} 
          spinning={spinning} 
          result={result}
          lastWin={lastWin}
          onWithdraw={() => setShowWithdraw(true)}
          onAura={() => rainRef.current?.drop('да ты хоть штаны сними не поможет 😂')}
        />
      </main>

      <CommentRain ref={rainRef} />
      <BonusRain active={showBonusRain} />
      <WithdrawOverlay show={showWithdraw} onClose={() => setShowWithdraw(false)} />

      <AnimatePresence>
      </AnimatePresence>

      {showBonus && (
        <BonusGame 
          onClose={(win) => {
            setShowBonus(false);
            if (win) setBalance(prev => prev + win);
          }}
          onAura={() => rainRef.current?.drop('да ты хоть штаны сними не поможет 😂')}
        />
      )}
    </div>
  );
}
