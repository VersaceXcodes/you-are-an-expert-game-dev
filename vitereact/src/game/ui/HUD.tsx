import React from 'react';

interface HUDProps {
  hp: number;
  maxHp: number;
}

const HUD: React.FC<HUDProps> = ({ hp, maxHp }) => {
  const hpPercentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className="absolute top-4 left-4 w-64 p-3 bg-slate-900/80 rounded-lg border border-slate-700 shadow-lg pointer-events-none select-none">
      <div className="flex justify-between mb-1 text-slate-100 text-sm font-bold tracking-wider">
        <span>HP</span>
        <span>{Math.ceil(hp)}/{maxHp}</span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-800">
        <div 
          className="h-full bg-red-500 transition-all duration-200 ease-out"
          style={{ width: `${hpPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default HUD;
