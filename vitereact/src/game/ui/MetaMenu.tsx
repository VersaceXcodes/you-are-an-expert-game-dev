import React from 'react';

interface MetaMenuProps {
  onBack: () => void;
}

const MetaMenu: React.FC<MetaMenuProps> = ({ onBack }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white">
      <h2 className="text-4xl font-bold mb-8 text-purple-400">Meta Upgrades</h2>
      <div className="text-gray-400 mb-8">Coming Soon...</div>
      <button 
        onClick={onBack}
        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-lg transition-all"
      >
        BACK
      </button>
    </div>
  );
};

export default MetaMenu;
