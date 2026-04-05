import { useState } from "react";
import { motion } from "framer-motion";
import { useCasino } from "@/context/CasinoContext";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const DiceRoll = () => {
  const { balance, resolveOutcome, addBalance, subtractBalance, formatBalance } = useCasino();
  const [bet, setBet] = useState(10);
  const [guess, setGuess] = useState(4); // guess "over" or "under" this
  const [mode, setMode] = useState<"over" | "under">("over");
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [lastWin, setLastWin] = useState<boolean | null>(null);

  const roll = () => {
    if (bet > balance || bet <= 0 || rolling) return;
    setRolling(true);
    setLastWin(null);

    setTimeout(() => {
      const win = resolveOutcome();
      // Generate dice that match the outcome
      let d1: number, d2: number, total: number;
      if (win) {
        do {
          d1 = Math.ceil(Math.random() * 6);
          d2 = Math.ceil(Math.random() * 6);
          total = d1 + d2;
        } while (mode === "over" ? total <= guess : total >= guess);
      } else {
        do {
          d1 = Math.ceil(Math.random() * 6);
          d2 = Math.ceil(Math.random() * 6);
          total = d1 + d2;
        } while (mode === "over" ? total > guess : total < guess);
      }

      setDice([d1, d2]);
      setLastWin(win);
      if (win) addBalance(bet);
      else subtractBalance(bet);
      setRolling(false);
    }, 1000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-5">
      <h2 className="font-display text-lg font-bold text-primary text-glow-gold">DICE ROLL</h2>

      <div className="flex gap-4 text-6xl h-24 items-center">
        {rolling ? (
          <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 0.3, repeat: 3 }}>
            🎲
          </motion.span>
        ) : (
          <>
            <span>{DICE_FACES[dice[0] - 1]}</span>
            <span>{DICE_FACES[dice[1] - 1]}</span>
          </>
        )}
      </div>

      {!rolling && (
        <p className="text-muted-foreground text-sm">
          Total: <span className="text-foreground font-display font-bold">{dice[0] + dice[1]}</span>
        </p>
      )}

      {lastWin !== null && (
        <p className={`font-display text-sm font-bold ${lastWin ? "text-secondary text-glow-green" : "text-accent text-glow-red"}`}>
          {lastWin ? `+${formatBalance(bet)} WIN!` : `-${formatBalance(bet)} LOSS`}
        </p>
      )}

      <div className="flex gap-3 items-center">
        <button
          onClick={() => setMode("over")}
          className={`px-4 py-2 rounded-md font-display text-sm font-bold transition-all ${
            mode === "over" ? "bg-secondary text-secondary-foreground neon-green" : "bg-muted text-muted-foreground"
          }`}
        >
          OVER
        </button>
        <select
          value={guess}
          onChange={(e) => setGuess(Number(e.target.value))}
          className="bg-muted text-foreground border border-border rounded-md px-3 py-1.5 font-display text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {[3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button
          onClick={() => setMode("under")}
          className={`px-4 py-2 rounded-md font-display text-sm font-bold transition-all ${
            mode === "under" ? "bg-accent text-accent-foreground neon-red" : "bg-muted text-muted-foreground"
          }`}
        >
          UNDER
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
        onClick={roll}
        disabled={rolling || bet > balance || bet <= 0}
        className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg neon-gold hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
      >
        {rolling ? "ROLLING..." : "ROLL!"}
      </button>
    </div>
  );
};

export default DiceRoll;
