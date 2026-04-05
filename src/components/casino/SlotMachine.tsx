import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasino } from "@/context/CasinoContext";

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣"];

const SlotMachine = () => {
  const { balance, resolveOutcome, addBalance, subtractBalance, formatBalance } = useCasino();
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(["🍒", "🍋", "🔔"]);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<boolean | null>(null);

  const spin = () => {
    if (bet > balance || bet <= 0 || spinning) return;
    setSpinning(true);
    setLastWin(null);

    setTimeout(() => {
      const win = resolveOutcome();
      let newReels: string[];
      if (win) {
        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        newReels = [sym, sym, sym];
      } else {
        // Make sure not all match
        do {
          newReels = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          ];
        } while (newReels[0] === newReels[1] && newReels[1] === newReels[2]);
      }

      const multiplier = win ? (newReels[0] === "7️⃣" ? 5 : newReels[0] === "💎" ? 3 : 2) : 0;
      const winnings = bet * multiplier;

      setReels(newReels);
      setLastWin(win);
      if (win) addBalance(winnings);
      else subtractBalance(bet);
      setSpinning(false);
    }, 1500);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-5">
      <h2 className="font-display text-lg font-bold text-primary text-glow-gold">SLOTS</h2>

      <div className="flex gap-3">
        {reels.map((sym, i) => (
          <div
            key={i}
            className="w-20 h-24 bg-muted border-2 border-border rounded-lg flex items-center justify-center text-4xl"
          >
            <AnimatePresence mode="wait">
              {spinning ? (
                <motion.span
                  key="spin"
                  animate={{ y: [0, -20, 20, -10, 10, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  {SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]}
                </motion.span>
              ) : (
                <motion.span
                  key={sym + i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {sym}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {lastWin !== null && (
        <p className={`font-display text-sm font-bold ${lastWin ? "text-secondary text-glow-green" : "text-accent text-glow-red"}`}>
          {lastWin
            ? `+${formatBalance(bet * (reels[0] === "7️⃣" ? 5 : reels[0] === "💎" ? 3 : 2))} WIN!`
            : `-${formatBalance(bet)} LOSS`}
        </p>
      )}

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-sm">Bet:</span>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
          className="w-24 bg-muted text-foreground border border-border rounded-md px-3 py-1.5 text-center font-display text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || bet > balance || bet <= 0}
        className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg neon-gold hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
      >
        {spinning ? "SPINNING..." : "SPIN!"}
      </button>
    </div>
  );
};

export default SlotMachine;
