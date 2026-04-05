import { useCasino } from "@/context/CasinoContext";

const BalanceBar = () => {
  const { balance, formatBalance, currency, currencies, setCurrency } = useCasino();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <h1 className="font-display text-2xl font-black text-primary text-glow-gold tracking-wider">
        🎰 NEON CASINO
      </h1>
      <div className="flex items-center gap-4">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-muted text-foreground border border-border rounded-md px-3 py-1.5 text-sm font-body focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {Object.entries(currencies).map(([code, { name }]) => (
            <option key={code} value={code}>
              {code} - {name}
            </option>
          ))}
        </select>
        <div className="font-display text-xl font-bold text-primary text-glow-gold">
          {formatBalance(balance)}
        </div>
      </div>
    </div>
  );
};

export default BalanceBar;
