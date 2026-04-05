import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCasino } from "@/context/CasinoContext";

const CoinFlip = () => {
  const { balance, resolveOutcome, addBalance, subtractBalance, formatBalance } = useCasino();
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [choice, setChoice] = useState<"heads" | "tails">("heads");
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<boolean | null>(null);

  const flip = () => {
    if (bet > balance || bet <= 0 || spinning) return;
    setSpinning(true);
    setResult(null);
    setLastWin(null);

    setTimeout(() => {
      const win = resolveOutcome();
      const landed = win ? choice : choice === "heads" ? "tails" : "heads";
      setResult(landed);
      setLastWin(win);
      if (win) addBalance(bet);
      else subtractBalance(bet);
      setSpinning(false);
    }, 1200);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-5">
      <h2 className="font-display text-lg font-bold text-primary text-glow-gold">COIN FLIP</h2>

      <div className="h-28 w-28 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {spinning ? (
            <motion.div
              key="spin"
              className="w-24 h-24 rounded-full bg-primary neon-gold flex items-center justify-center font-display text-3xl text-primary-foreground"
              animate={{ rotateY: [0, 1080] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              ?
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center font-display text-lg font-bold ${
                result === "heads"
                  ? "bg-primary text-primary-foreground neon-gold"
                  : result === "tails"
                  ? "bg-secondary text-secondary-foreground neon-green"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {result ? result.toUpperCase() : "?"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {lastWin !== null && (
        <p className={`font-display text-sm font-bold ${lastWin ? "text-secondary text-glow-green" : "text-accent text-glow-red"}`}>
          {lastWin ? `+${formatBalance(bet)} WIN!` : `-${formatBalance(bet)} LOSS`}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setChoice("heads")}
          className={`px-4 py-2 rounded-md font-display text-sm font-bold transition-all ${
            choice === "heads" ? "bg-primary text-primary-foreground neon-gold" : "bg-muted text-muted-foreground"
          }`}
        >
          HEADS
        </button>
        <button
          onClick={() => setChoice("tails")}
          className={`px-4 py-2 rounded-md font-display text-sm font-bold transition-all ${
            choice === "tails" ? "bg-secondary text-secondary-foreground neon-green" : "bg-muted text-muted-foreground"
          }`}
        >
          TAILS
        </button>
      </div>

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
        onClick={flip}
        disabled={spinning || bet > balance || bet <= 0}
        className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg neon-gold hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
      >
        {spinning ? "FLIPPING..." : "FLIP!"}
      </button>
    </div>
  );
};

export default CoinFlip;
