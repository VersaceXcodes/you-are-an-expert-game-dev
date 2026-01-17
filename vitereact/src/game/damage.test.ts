
import { describe, it, expect, beforeEach } from 'vitest';
import { GameLogic } from './GameLogic';
import { InputManager } from './InputManager';
import { PLAYER_MAX_HP } from './constants';

describe('GameLogic - Player Damage', () => {
  let game: GameLogic;
  let mockInput: InputManager;

  beforeEach(() => {
    game = new GameLogic();
    game.reset();
    game.enemies = [];
    game.bullets = [];
    game.state = 'RUN';
    
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

  it('should reduce player HP when enemy touches player', () => {
    // Place enemy on top of player
    const player = game.player!;
    const enemy = {
      id: 'e1',
      x: player.x,
      y: player.y,
      width: 32,
      height: 32,
      color: '#ff0000',
      hp: 100,
      maxHp: 100,
      speed: 0,
      vx: 0,
      vy: 0,
      damage: 10,
      type: 'CHASER' as const,
      markedForDeletion: false
    };
    // @ts-ignore
    game.enemies.push(enemy);

    expect(player.hp).toBe(PLAYER_MAX_HP);

    // Update game loop
    game.update(0.1, mockInput, 0, 0);

    expect(player.hp).toBe(PLAYER_MAX_HP - 10);
  });

  it('should give player invulnerability after taking damage', () => {
    const player = game.player!;
    const enemy = {
      id: 'e1',
      x: player.x,
      y: player.y,
      width: 32,
      height: 32,
      color: '#ff0000',
      hp: 100,
      maxHp: 100,
      speed: 0,
      vx: 0,
      vy: 0,
      damage: 10,
      type: 'CHASER' as const,
      markedForDeletion: false
    };
    // @ts-ignore
    game.enemies.push(enemy);

    // First hit
    game.update(0.1, mockInput, 0, 0);
    expect(player.hp).toBe(PLAYER_MAX_HP - 10);

    // Second update immediately after - should not damage again
    game.update(0.1, mockInput, 0, 0);
    expect(player.hp).toBe(PLAYER_MAX_HP - 10);
  });
});
