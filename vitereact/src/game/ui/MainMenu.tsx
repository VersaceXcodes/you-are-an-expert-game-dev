import React from 'react';
import { GameState } from '../types';

interface MainMenuProps {
  onStart: () => void;
  onUpgrades: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onUpgrades, onSettings, onQuit }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
      <h1 className="text-6xl font-bold mb-12 text-red-500 tracking-widest uppercase shadow-red-900/50 drop-shadow-lg">
        One Room Dungeon
      </h1>
      
      <div className="flex flex-col gap-4 w-64">
        <button 
          onClick={onStart}
          className="px-6 py-3 bg-red-700 hover:bg-red-600 border border-red-500 rounded text-xl font-bold transition-all transform hover:scale-105"
        >
          PLAY
        </button>
        
        <button 
          onClick={onUpgrades}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-lg font-semibold transition-all hover:text-red-300"
        >
          META UPGRADES
        </button>
        
        <button 
          onClick={onSettings}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-lg font-semibold transition-all hover:text-red-300"
        >
          SETTINGS
        </button>
        
        <button 
          onClick={onQuit}
          className="px-6 py-3 bg-gray-900 hover:bg-black border border-gray-800 rounded text-lg text-gray-400 font-semibold transition-all hover:text-gray-200"
        >
          QUIT
        </button>
      </div>
      
      <div className="absolute bottom-4 text-gray-500 text-sm">
        WASD to Move | Mouse to Aim & Shoot | Space to Dash
      </div>
    </div>
  );
};

export default MainMenu;
