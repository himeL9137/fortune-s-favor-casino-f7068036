import { CasinoProvider } from "@/context/CasinoContext";
import BalanceBar from "@/components/casino/BalanceBar";
import CoinFlip from "@/components/casino/CoinFlip";
import DiceRoll from "@/components/casino/DiceRoll";
import SlotMachine from "@/components/casino/SlotMachine";

const Index = () => {
  return (
    <CasinoProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <BalanceBar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <SlotMachine />
            <CoinFlip />
            <DiceRoll />
          </div>
          <p className="text-center text-muted-foreground text-xs mt-8 font-body">
            For entertainment purposes only. Not real gambling.
          </p>
        </main>
      </div>
    </CasinoProvider>
  );
};

export default Index;
