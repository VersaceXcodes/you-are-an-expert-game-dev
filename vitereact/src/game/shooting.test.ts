
import { describe, it, expect, beforeEach } from 'vitest';
import { GameLogic } from './GameLogic';
import { InputManager } from './InputManager';

describe('GameLogic - Shooting', () => {
  let game: GameLogic;
  let mockInput: InputManager;

  beforeEach(() => {
    game = new GameLogic();
    // Setup player
    game.reset();
    game.state = 'RUN';
    
    // Mock InputManager
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

  it('should initialize player with correct weapon stats', () => {
    expect(game.player).toBeDefined();
    expect(game.player?.fireRate).toBe(3);
    expect(game.player?.damage).toBe(10);
    expect(game.player?.bulletSpread).toBeDefined();
  });

  it('should fire a bullet when left mouse is held', () => {
    mockInput.mouse.left = true;
    
    // Advance time enough for one shot (fireRate 3 = 0.333s)
    // Initial lastFired is 0, fireInterval is 1/3 = 0.333
    // We need update loop to accumulate lastFired.
    
    // update adds dt to lastFired.
    // if lastFired >= fireInterval, it fires.
    
    // First update, dt = 0.34
    game.update(0.34, mockInput, 100, 100);
    
    expect(game.bullets.length).toBe(1);
    const bullet = game.bullets[0];
    expect(bullet.damage).toBe(10);
    expect(bullet.vx).not.toBe(0); // Should have velocity
  });

  it('should respect fire rate', () => {
    mockInput.mouse.left = true;
    const fireInterval = 1 / 3; // 0.333s
    
    // 1. Fire first shot
    game.update(fireInterval + 0.01, mockInput, 100, 100);
    expect(game.bullets.length).toBe(1);
    
    // 2. Try to fire immediately again (should fail)
    game.update(0.1, mockInput, 100, 100);
    expect(game.bullets.length).toBe(1);
    
    // 3. Advance time to allow second shot
    // We already advanced 0.1. We need to reach fireInterval again.
    // lastFired was reset to 0 after first shot.
    // so we need another 0.24s (0.1 + 0.24 = 0.34 > 0.333)
    game.update(0.24, mockInput, 100, 100);
    expect(game.bullets.length).toBe(2);
  });

  it('should apply spread', () => {
    mockInput.mouse.left = true;
    
    const velocities: number[] = [];
    
    for (let i = 0; i < 10; i++) {
        // Reset lastFired to ensure we can fire immediately (ignoring rate for this test if we manipulate state)
        // But better to just run update enough time.
        game.player!.lastFired = 100; // Force ready to fire
        game.bullets = []; // Clear previous bullets to avoid collision/management noise
        
        game.update(0.016, mockInput, 100, 100); // Small dt, just to fire
        
        if (game.bullets.length > 0) {
            velocities.push(game.bullets[0].vx);
        }
    }
    
    expect(velocities.length).toBe(10);
    const uniqueVxs = new Set(velocities);
    expect(uniqueVxs.size).toBeGreaterThan(1);
  });
});
