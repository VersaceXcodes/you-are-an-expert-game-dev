import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upgrade, getRandomUpgrades } from '../upgrades';

interface UpgradeMenuProps {
  onSelect: (upgrade: Upgrade) => void;
}

const UpgradeMenu: React.FC<UpgradeMenuProps> = ({ onSelect }) => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);

  useEffect(() => {
    setUpgrades(getRandomUpgrades(3));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="max-w-4xl w-full p-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Choose an Upgrade</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upgrades.map((upgrade) => (
            <Card 
              key={upgrade.id} 
              className="bg-gray-800 border-gray-700 text-white hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => onSelect(upgrade)}
            >
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">{upgrade.name}</CardTitle>
                <CardDescription className="text-gray-400 capitalize">{upgrade.rarity}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{upgrade.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(upgrade);
                  }}
                >
                  Select
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradeMenu;
