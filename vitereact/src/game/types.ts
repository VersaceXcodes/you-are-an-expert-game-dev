export type GameState = 'MENU' | 'RUN' | 'UPGRADE' | 'PAUSE' | 'GAMEOVER' | 'META_MENU' | 'SETTINGS';

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  markedForDeletion: boolean;
}

export interface Player extends Entity {
  hp: number;
  maxHp: number;
  speed: number;
  vx: number;
  vy: number;
  dashCooldown: number;
  dashTimer: number;
  dashVx: number;
  dashVy: number;
  isInvulnerable: boolean;
  invulnerabilityTimer: number;
  aimAngle: number;
  // Weapon stats
  damage: number;
  fireRate: number; // shots per second
  lastFired: number;
  bulletSpeed: number;
  bulletSpread: number;
}

export interface Bullet extends Entity {
  vx: number;
  vy: number;
  damage: number;
  isEnemy: boolean;
}

export interface Enemy extends Entity {
  hp: number;
  maxHp: number;
  speed: number;
  vx: number;
  vy: number;
  damage: number;
  type: 'CHASER' | 'SHOOTER' | 'TANK';
  hitTimer?: number;
  // Shooter specific
  attackRange?: number;
  fireRate?: number;
  lastFired?: number;
  bulletSpeed?: number;
}
