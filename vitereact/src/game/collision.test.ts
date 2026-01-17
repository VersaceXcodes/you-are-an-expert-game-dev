
import { describe, it, expect, beforeEach } from 'vitest';
import { GameLogic } from './GameLogic';
import { InputManager } from './InputManager';
import { ARENA_X, ARENA_Y, ARENA_WIDTH, ARENA_HEIGHT } from './constants';

describe('GameLogic - Collision', () => {
  let game: GameLogic;
  let mockInput: InputManager;

  beforeEach(() => {
    game = new GameLogic();
    game.reset();
    game.enemies = []; // Clear auto-spawned enemies for isolation
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

  it('should destroy bullets when hitting walls', () => {
    // Spawn a bullet near the right wall moving right
    game.bullets.push({
      id: 'b1',
      x: ARENA_X + ARENA_WIDTH - 5,
      y: ARENA_Y + 100,
      width: 8,
      height: 8,
      color: '#ffff00',
      vx: 100,
      vy: 0,
      damage: 10,
      markedForDeletion: false,
      isEnemy: false
    });

    // Update to move bullet past wall
    game.update(0.1, mockInput, 0, 0);

    // Bullet should be marked for deletion
    // The current logic removes marked bullets at the end of update
    expect(game.bullets.length).toBe(0);
  });

  it('should destroy bullets when hitting obstacles', () => {
    // Add a dummy obstacle
    const obstacle = {
      id: 'obs1',
      x: 200,
      y: 200,
      width: 50,
      height: 50,
      color: '#555',
      markedForDeletion: false
    };
    game.obstacles.push(obstacle);

    // Spawn a bullet aiming at the obstacle
    game.bullets.push({
      id: 'b1',
      x: 150, // Left of obstacle
      y: 200, // Center y
      width: 8,
      height: 8,
      color: '#ffff00',
      vx: 100, // Moving right
      vy: 0,
      damage: 10,
      markedForDeletion: false,
      isEnemy: false
    });

    // Update to hit obstacle
    // Distance 50px. Speed 100px/s. 0.5s to hit.
    // Obstacle x=200, width=50. Left edge is 175.
    // Bullet starts x=150.
    // Need to travel 25px to hit edge. 0.25s.
    game.update(0.3, mockInput, 0, 0);

    expect(game.bullets.length).toBe(0);
  });

  it('should destroy bullets and damage enemies when hitting enemies', () => {
    // Add a dummy enemy
    const enemy = {
      id: 'e1',
      x: 300,
      y: 300,
      width: 32,
      height: 32,
      color: '#ff0000',
      hp: 100,
      maxHp: 100,
      speed: 0, // Stationary for collision test
      vx: 0,
      vy: 0,
      damage: 10,
      type: 'CHASER' as const,
      markedForDeletion: false
    };
    // @ts-ignore - explicitly testing enemy collision
    game.enemies.push(enemy);

    // Spawn a bullet aiming at the enemy
    game.bullets.push({
      id: 'b1',
      x: 250,
      y: 300,
      width: 8,
      height: 8,
      color: '#ffff00',
      vx: 100,
      vy: 0,
      damage: 10,
      markedForDeletion: false,
      isEnemy: false
    });

    // Update to hit enemy
    game.update(0.6, mockInput, 0, 0);

    // Bullet should be gone
    expect(game.bullets.length).toBe(0);
    
    // Enemy should take damage
    const updatedEnemy = game.enemies[0];
    expect(updatedEnemy.hp).toBe(90); // 100 - 10
  });

  it('should kill enemy when hp reaches 0', () => {
    // Add a low HP enemy
    const enemy = {
      id: 'e1',
      x: 300,
      y: 300,
      width: 32,
      height: 32,
      color: '#ff0000',
      hp: 10,
      maxHp: 100,
      speed: 0, // Stationary
      vx: 0,
      vy: 0,
      damage: 10,
      type: 'CHASER' as const,
      markedForDeletion: false
    };
    // @ts-ignore
    game.enemies.push(enemy);

    // Spawn a bullet
    game.bullets.push({
      id: 'b1',
      x: 250,
      y: 300,
      width: 8,
      height: 8,
      color: '#ffff00',
      vx: 100,
      vy: 0,
      damage: 10,
      markedForDeletion: false,
      isEnemy: false
    });

    game.update(0.6, mockInput, 0, 0);

    // Enemy should be removed (or marked for deletion and removed)
    // The current logic usually removes marked entities, or filters them. 
    // We'll check if it's removed from the array or marked.
    // If logic removes it immediately:
    expect(game.enemies.length).toBe(0);
  });
});
