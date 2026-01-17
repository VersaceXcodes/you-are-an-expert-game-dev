import { Player, GameState, Entity, Bullet, Enemy } from './types';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  WALL_THICKNESS, 
  ARENA_X, 
  ARENA_Y, 
  ARENA_WIDTH, 
  ARENA_HEIGHT,
  PLAYER_BASE_SPEED,
  PLAYER_MAX_HP
} from './constants';
import { InputManager } from './InputManager';

export class GameLogic {
  player: Player | null = null;
  state: GameState = 'MENU';
  obstacles: Entity[] = [];
  bullets: Bullet[] = [];
  enemies: Enemy[] = [];
  
  constructor() {
    this.reset();
  }

  reset() {
    this.player = {
      id: 'player',
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      width: 32,
      height: 32,
      color: '#00ff00',
      hp: PLAYER_MAX_HP,
      maxHp: PLAYER_MAX_HP,
      speed: PLAYER_BASE_SPEED,
      vx: 0,
      vy: 0,
      dashCooldown: 0,
      isInvulnerable: false,
      markedForDeletion: false,
      aimAngle: 0,
      damage: 10,
      fireRate: 3,
      lastFired: 0,
      bulletSpeed: 600,
      bulletSpread: 0.1 // Radians
    };

    this.bullets = [];
    this.enemies = [];

    // Obstacles will be added in a later feature
    this.obstacles = [];
  }

  clampToArena(entity: Entity, nextX: number, nextY: number): { x: number, y: number } {
    const halfW = entity.width / 2;
    const halfH = entity.height / 2;

    const x = Math.max(ARENA_X + halfW, Math.min(ARENA_X + ARENA_WIDTH - halfW, nextX));
    const y = Math.max(ARENA_Y + halfH, Math.min(ARENA_Y + ARENA_HEIGHT - halfH, nextY));
    
    return { x, y };
  }

  update(dt: number, input: InputManager, mouseX: number, mouseY: number) {
    if (this.state !== 'RUN') return;
    if (!this.player) return;

    // Feature 7: Aiming
    const dx = mouseX - this.player.x;
    const dy = mouseY - this.player.y;
    this.player.aimAngle = Math.atan2(dy, dx);

    // Feature 6: Player movement
    let mx = 0;
    let my = 0;

    if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) my -= 1;
    if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) my += 1;
    if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) mx -= 1;
    if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) mx += 1;

    if (mx !== 0 || my !== 0) {
      const length = Math.sqrt(mx * mx + my * my);
      mx /= length;
      my /= length;
    }

    const moveSpeed = this.player.speed * dt;
    const nextX = this.player.x + mx * moveSpeed;
    const nextY = this.player.y + my * moveSpeed;

    // Feature 4: Wall collisions (Clamp)
    const clamped = this.clampToArena(this.player, nextX, nextY);
    let finalX = clamped.x;
    let finalY = clamped.y;

    // Feature 27: Obstacle collisions
    for (const obs of this.obstacles) {
      if (this.checkCollision({ ...this.player, x: finalX, y: this.player.y }, obs)) {
        finalX = this.player.x;
      }
      if (this.checkCollision({ ...this.player, x: finalX, y: finalY }, obs)) {
        finalY = this.player.y;
      }
    }

    this.player.x = finalX;
    this.player.y = finalY;

    // Update Enemies
    for (const enemy of this.enemies) {
      // Placeholder movement logic (enemies don't move yet but need to be constrained)
      const enemyNextX = enemy.x + enemy.vx * dt;
      const enemyNextY = enemy.y + enemy.vy * dt;

      const clampedEnemy = this.clampToArena(enemy, enemyNextX, enemyNextY);
      let eFinalX = clampedEnemy.x;
      let eFinalY = clampedEnemy.y;

      // Enemy vs Obstacle collision
      for (const obs of this.obstacles) {
        if (this.checkCollision({ ...enemy, x: eFinalX, y: enemy.y }, obs)) {
          eFinalX = enemy.x;
        }
        if (this.checkCollision({ ...enemy, x: eFinalX, y: eFinalY }, obs)) {
          eFinalY = enemy.y;
        }
      }

      enemy.x = eFinalX;
      enemy.y = eFinalY;
    }

    // Feature 8: Shooting
    this.player.lastFired += dt;
    if (input.mouse.left) {
      const fireInterval = 1 / this.player.fireRate;
      if (this.player.lastFired >= fireInterval) {
        this.fireBullet();
        this.player.lastFired = 0;
      }
    }

    // Feature 9: Bullet Updates
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Wall collision
      if (b.x < ARENA_X || b.x > ARENA_X + ARENA_WIDTH || b.y < ARENA_Y || b.y > ARENA_Y + ARENA_HEIGHT) {
        b.markedForDeletion = true;
      }

      // Obstacle collision
      for (const obs of this.obstacles) {
        if (this.checkCollision(b, obs)) {
          b.markedForDeletion = true;
          break;
        }
      }

      if (b.markedForDeletion) {
        this.bullets.splice(i, 1);
      }
    }
  }

  fireBullet() {
    if (!this.player) return;
    
    const spread = (Math.random() - 0.5) * this.player.bulletSpread;
    const angle = this.player.aimAngle + spread;
    const vx = Math.cos(angle) * this.player.bulletSpeed;
    const vy = Math.sin(angle) * this.player.bulletSpeed;

    this.bullets.push({
      id: Math.random().toString(),
      x: this.player.x,
      y: this.player.y,
      width: 8,
      height: 8,
      color: '#ffff00',
      vx,
      vy,
      damage: this.player.damage,
      markedForDeletion: false
    });
  }

  checkCollision(a: Entity, b: Entity): boolean {
    return (
      a.x - a.width / 2 < b.x + b.width / 2 &&
      a.x + a.width / 2 > b.x - b.width / 2 &&
      a.y - a.height / 2 < b.y + b.height / 2 &&
      a.y + a.height / 2 > b.y - b.height / 2
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Clear background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Feature 4: Draw Arena Walls
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, CANVAS_WIDTH, WALL_THICKNESS);
    ctx.fillRect(0, CANVAS_HEIGHT - WALL_THICKNESS, CANVAS_WIDTH, WALL_THICKNESS);
    ctx.fillRect(0, 0, WALL_THICKNESS, CANVAS_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - WALL_THICKNESS, 0, WALL_THICKNESS, CANVAS_HEIGHT);

    // Draw Arena Floor
    ctx.fillStyle = '#222';
    ctx.fillRect(ARENA_X, ARENA_Y, ARENA_WIDTH, ARENA_HEIGHT);

    // Feature 27: Draw Obstacles
    ctx.fillStyle = '#555';
    for (const obs of this.obstacles) {
      ctx.fillRect(
        obs.x - obs.width / 2,
        obs.y - obs.height / 2,
        obs.width,
        obs.height
      );
    }

    // Draw Enemies
    for (const enemy of this.enemies) {
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
    }

    // Feature 8/9: Draw Bullets
    for (const b of this.bullets) {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.width / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Feature 5/7: Draw Player and Aim
    if (this.player) {
      ctx.save();
      ctx.translate(this.player.x, this.player.y);
      ctx.rotate(this.player.aimAngle);
      
      // Player body (square)
      ctx.fillStyle = this.player.color;
      ctx.fillRect(-this.player.width / 2, -this.player.height / 2, this.player.width, this.player.height);
      
      // Gun/Pointer
      ctx.fillStyle = '#fff';
      ctx.fillRect(10, -4, 20, 8); // Stick out to the right

      ctx.restore();
    }
  }
}

