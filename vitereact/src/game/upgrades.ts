import { Player } from './types';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  apply: (player: Player) => void;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'health_boost',
    name: 'Vitality Boost',
    description: 'Increase Max HP by 20',
    rarity: 'common',
    apply: (player: Player) => {
      player.maxHp += 20;
      player.hp += 20;
    }
  },
  {
    id: 'damage_up',
    name: 'Power Shot',
    description: 'Increase Damage by 2',
    rarity: 'common',
    apply: (player: Player) => {
      player.damage += 2;
    }
  },
  {
    id: 'fire_rate',
    name: 'Rapid Fire',
    description: 'Increase Fire Rate by 10%',
    rarity: 'rare',
    apply: (player: Player) => {
      player.fireRate *= 1.1;
    }
  },
  {
    id: 'speed_up',
    name: 'Agility',
    description: 'Increase Move Speed by 10%',
    rarity: 'common',
    apply: (player: Player) => {
      player.speed *= 1.1;
    }
  },
  {
    id: 'laser_focus',
    name: 'Laser Focus',
    description: 'Reduce Bullet Spread by 20%',
    rarity: 'rare',
    apply: (player: Player) => {
      player.bulletSpread *= 0.8;
    }
  },
  {
    id: 'bullet_speed',
    name: 'Velocity',
    description: 'Increase Bullet Speed by 20%',
    rarity: 'common',
    apply: (player: Player) => {
      player.bulletSpeed *= 1.2;
    }
  },
  {
    id: 'full_heal',
    name: 'Full Restore',
    description: 'Heal to full HP',
    rarity: 'rare',
    apply: (player: Player) => {
      player.hp = player.maxHp;
    }
  },
  {
    id: 'piercing',
    name: 'Piercing Rounds',
    description: 'Bullets pierce through 1 additional enemy',
    rarity: 'common',
    apply: (player: Player) => {
      player.piercing += 1;
    }
  },
  {
    id: 'crit_master',
    name: 'Critical Strike',
    description: '15% chance to deal 2x damage',
    rarity: 'rare',
    apply: (player: Player) => {
      player.critChance += 0.15;
    }
  },
  {
    id: 'chain_lightning',
    name: 'Chain Lightning',
    description: 'Bullets arc to nearby enemies on hit',
    rarity: 'epic',
    apply: (player: Player) => {
      player.hasChainLightning = true;
    }
  },
  {
    id: 'orbiting_blades',
    name: 'Orbiting Blades',
    description: 'Summon blades that orbit you and damage enemies',
    rarity: 'legendary',
    apply: (player: Player) => {
      player.hasOrbitingBlades = true;
    }
  }
];

export const getRandomUpgrades = (count: number): Upgrade[] => {
  const shuffled = [...UPGRADES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
