
import { describe, it, expect, beforeEach } from 'vitest';
import { GameLogic } from './GameLogic';
import { InputManager } from './InputManager';
import { ENEMY_CHASER_HP, ENEMY_CHASER_DAMAGE } from './constants';
import { Bullet } from './types';

describe('GameLogic - Enemy Damage', () => {
  let game: GameLogic;
  let mockInput: InputManager;

  beforeEach(() => {
    game = new GameLogic();
    game.reset();
    game.state = 'RUN';
    game.enemies = [];
    game.bullets = [];
    
    mockInput = {
      keys: {},
      mouse: { x: 0, y: 0, left: false },
      isKeyDown: () => false,
      setMousePos: () => {},
      destroy: () => {},
      handleKeyDown: () => {},
      handleKeyUp: () => {},
      handleMouseMove: () => {},
      handleMouseDown: () => {},
      handleMouseUp: () => {},
    } as unknown as InputManager;
  });

  it('should reduce enemy HP when hit by player bullet', () => {
    // Setup enemy
    const enemy = {
      id: 'e1',
      x: 100,
      y: 100,
      width: 32,
      height: 32,
      color: '#ff0000',
      hp: ENEMY_CHASER_HP,
      maxHp: ENEMY_CHASER_HP,
      speed: 0,
      vx: 0,
      vy: 0,
      damage: 10,
      type: 'CHASER' as const,
      markedForDeletion: false
    };
    // @ts-ignore
    game.enemies.push(enemy);

    // Setup bullet hitting the enemy
    const bullet: Bullet = {
      id: 'b1',
      x: 100,
      y: 100,
      width: 8,
      height: 8,
      color: '#ffff00',
      vx: 0,
      vy: 0,
      damage: 10,
      markedForDeletion: false,
      isEnemy: false
    };
    game.bullets.push(bullet);

    // Run update
    game.update(0.1, mockInput, 0, 0);

    // Check damage
    expect(enemy.hp).toBe(ENEMY_CHASER_HP - 10);
    // Bullet should be destroyed
    expect(bullet.markedForDeletion).toBe(true);
  });

  it('should destroy enemy when HP reaches 0', () => {
    // Setup enemy with low HP
    const enemy = {
      id: 'e1',
      x: 100,
      y: 100,
      width: 32,
      height: 32,
      color: '#ff0000',
      hp: 10, // 10 HP
      maxHp: ENEMY_CHASER_HP,
      speed: 0,
      vx: 0,
      vy: 0,
      damage: 10,
      type: 'CHASER' as const,
      markedForDeletion: false
    };
    // @ts-ignore
    game.enemies.push(enemy);

    // Bullet with enough damage
    const bullet: Bullet = {
      id: 'b1',
      x: 100,
      y: 100,
      width: 8,
      height: 8,
      color: '#ffff00',
      vx: 0,
      vy: 0,
      damage: 10,
      markedForDeletion: false,
      isEnemy: false
    };
    game.bullets.push(bullet);

    // Run update
    game.update(0.1, mockInput, 0, 0);

    // Check destruction
    expect(enemy.hp).toBe(0);
    expect(enemy.markedForDeletion).toBe(true);
  });
});
