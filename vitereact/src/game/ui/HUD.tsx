import React from 'react';

interface HUDProps {
  hp: number;
  maxHp: number;
  dashCooldown: number;
  maxDashCooldown: number;
}

const HUD: React.FC<HUDProps> = ({ hp, maxHp, dashCooldown, maxDashCooldown }) => {
  const hpPercentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const dashPercentage = Math.max(0, Math.min(100, (1 - (dashCooldown / maxDashCooldown)) * 100));

  return (
    <div className="absolute top-4 left-4 w-64 p-3 bg-slate-900/80 rounded-lg border border-slate-700 shadow-lg pointer-events-none select-none">
      <div className="flex justify-between mb-1 text-slate-100 text-sm font-bold tracking-wider">
        <span>HP</span>
        <span>{Math.ceil(hp)}/{maxHp}</span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-800 mb-2">
        <div 
          className="h-full bg-red-500 transition-all duration-200 ease-out"
          style={{ width: `${hpPercentage}%` }}
        />
      </div>

      <div className="flex justify-between mb-1 text-slate-100 text-xs font-bold tracking-wider">
        <span>DASH</span>
        <span>{dashCooldown > 0 ? dashCooldown.toFixed(1) + 's' : 'READY'}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div 
          className={`h-full transition-all duration-100 ease-out ${dashCooldown <= 0 ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'bg-blue-600'}`}
          style={{ width: `${dashPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default HUD;
