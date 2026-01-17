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
  PLAYER_MAX_HP,
  PLAYER_DASH_SPEED,
  PLAYER_DASH_DURATION,
  PLAYER_DASH_COOLDOWN,
  ENEMY_CHASER_HP,
  ENEMY_CHASER_SPEED,
  ENEMY_CHASER_DAMAGE,
  ENEMY_CHASER_SIZE,
  ENEMY_CHASER_COLOR,
  ENEMY_SHOOTER_HP,
  ENEMY_SHOOTER_SPEED,
  ENEMY_SHOOTER_DAMAGE,
  ENEMY_SHOOTER_SIZE,
  ENEMY_SHOOTER_COLOR,
  ENEMY_SHOOTER_RANGE,
  ENEMY_SHOOTER_FIRE_RATE,
  ENEMY_SHOOTER_BULLET_SPEED,
  ENEMY_SHOOTER_BULLET_SIZE,
  ENEMY_SHOOTER_BULLET_COLOR,
  ENEMY_TANK_HP,
  ENEMY_TANK_SPEED,
  ENEMY_TANK_DAMAGE,
  ENEMY_TANK_SIZE,
  ENEMY_TANK_COLOR,
  WAVE_INTERVAL
} from './constants';
import { InputManager } from './InputManager';

export class GameLogic {
  player: Player | null = null;
  state: GameState = 'MENU';
  obstacles: Entity[] = [];
  bullets: Bullet[] = [];
  enemies: Enemy[] = [];
  
  // Wave Management
  currentWave: number = 0;
  waveTimer: number = 0;
  
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
      dashTimer: 0,
      dashVx: 0,
      dashVy: 0,
      isInvulnerable: false,
      invulnerabilityTimer: 0,
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
    this.obstacles = [];
    
    this.currentWave = 1;
    this.waveTimer = 0;
    
    this.spawnWave();
  }

  spawnWave() {
    const waveSize = 2 + Math.floor(this.currentWave * 1.5);
    
    for (let i = 0; i < waveSize; i++) {
      // Determine enemy type based on wave
      // Wave 1: All Chasers
      // Wave 2: Mix of Chasers and Shooters
      // Wave 3+: Mix of Chasers, Shooters, and Tanks
      let type: 'CHASER' | 'SHOOTER' | 'TANK' = 'CHASER';
      
      if (this.currentWave >= 3) {
        const rand = Math.random();
        if (rand < 0.2) type = 'TANK'; // 20% Tanks
        else if (rand < 0.6) type = 'SHOOTER'; // 40% Shooters
        else type = 'CHASER'; // 40% Chasers
      } else if (this.currentWave >= 2) {
        type = Math.random() > 0.5 ? 'SHOOTER' : 'CHASER';
      }

      // Random position around the edges of the arena (but inside)
      let x, y;
      const edge = Math.floor(Math.random() * 4);
      const padding = 50;
      
      switch(edge) {
        case 0: // Top
          x = ARENA_X + Math.random() * ARENA_WIDTH;
          y = ARENA_Y + padding;
          break;
        case 1: // Right
          x = ARENA_X + ARENA_WIDTH - padding;
          y = ARENA_Y + Math.random() * ARENA_HEIGHT;
          break;
        case 2: // Bottom
          x = ARENA_X + Math.random() * ARENA_WIDTH;
          y = ARENA_Y + ARENA_HEIGHT - padding;
          break;
        default: // Left
          x = ARENA_X + padding;
          y = ARENA_Y + Math.random() * ARENA_HEIGHT;
          break;
      }

      if (type === 'CHASER') {
        this.enemies.push({
          id: `enemy_${Date.now()}_${i}`,
          x,
          y,
          width: ENEMY_CHASER_SIZE,
          height: ENEMY_CHASER_SIZE,
          color: ENEMY_CHASER_COLOR,
          hp: ENEMY_CHASER_HP,
          maxHp: ENEMY_CHASER_HP,
          speed: ENEMY_CHASER_SPEED,
          vx: 0,
          vy: 0,
          damage: ENEMY_CHASER_DAMAGE,
          type: 'CHASER',
          markedForDeletion: false
        });
      } else if (type === 'TANK') {
        this.enemies.push({
          id: `enemy_${Date.now()}_${i}`,
          x,
          y,
          width: ENEMY_TANK_SIZE,
          height: ENEMY_TANK_SIZE,
          color: ENEMY_TANK_COLOR,
          hp: ENEMY_TANK_HP,
          maxHp: ENEMY_TANK_HP,
          speed: ENEMY_TANK_SPEED,
          vx: 0,
          vy: 0,
          damage: ENEMY_TANK_DAMAGE,
          type: 'TANK',
          markedForDeletion: false
        });
      } else {
        this.enemies.push({
          id: `enemy_${Date.now()}_${i}`,
          x,
          y,
          width: ENEMY_SHOOTER_SIZE,
          height: ENEMY_SHOOTER_SIZE,
          color: ENEMY_SHOOTER_COLOR,
          hp: ENEMY_SHOOTER_HP,
          maxHp: ENEMY_SHOOTER_HP,
          speed: ENEMY_SHOOTER_SPEED,
          vx: 0,
          vy: 0,
          damage: ENEMY_SHOOTER_DAMAGE,
          type: 'SHOOTER',
          markedForDeletion: false,
          attackRange: ENEMY_SHOOTER_RANGE,
          fireRate: ENEMY_SHOOTER_FIRE_RATE,
          lastFired: 0,
          bulletSpeed: ENEMY_SHOOTER_BULLET_SPEED
        });
      }
    }
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

    // Feature 6: Player movement & Dash
    if (this.player.dashCooldown > 0) {
      this.player.dashCooldown -= dt;
    }
    if (this.player.invulnerabilityTimer > 0) {
      this.player.invulnerabilityTimer -= dt;
    }

    let nextX = this.player.x;
    let nextY = this.player.y;

    if (this.player.dashTimer > 0) {
      // Dashing state
      this.player.dashTimer -= dt;
      nextX += this.player.dashVx * dt;
      nextY += this.player.dashVy * dt;

      if (this.player.dashTimer <= 0) {
        this.player.isInvulnerable = false;
        this.player.dashTimer = 0;
      }
    } else {
      // Normal movement
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

      // Check for Dash
      // Only dash if moving (mx/my != 0)
      if (input.isKeyDown('Space') && this.player.dashCooldown <= 0 && (mx !== 0 || my !== 0)) {
        this.player.dashTimer = PLAYER_DASH_DURATION;
        this.player.dashCooldown = PLAYER_DASH_COOLDOWN;
        this.player.isInvulnerable = true;
        this.player.dashVx = mx * PLAYER_DASH_SPEED;
        this.player.dashVy = my * PLAYER_DASH_SPEED;
        
        // Initial dash movement
        nextX += this.player.dashVx * dt;
        nextY += this.player.dashVy * dt;
      } else {
        const moveSpeed = this.player.speed * dt;
        nextX += mx * moveSpeed;
        nextY += my * moveSpeed;
      }
    }

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

    // Wave Logic
    if (this.enemies.length === 0) {
      this.waveTimer += dt;
      if (this.waveTimer >= 2) { // 2 seconds delay between waves
        this.currentWave++;
        this.spawnWave();
        this.waveTimer = 0;
      }
    }

    // Update Enemies
    for (const enemy of this.enemies) {
      // Check collision with player (Body Contact Damage)
      if (this.checkCollision(enemy, this.player) && !this.player.isInvulnerable && this.player.invulnerabilityTimer <= 0) {
        this.player.hp -= enemy.damage;
        this.player.invulnerabilityTimer = 1.0;
        if (this.player.hp < 0) this.player.hp = 0;
      }

      // Calculate vector to player
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let moveX = 0;
      let moveY = 0;

      if (enemy.type === 'CHASER' || enemy.type === 'TANK') {
        if (dist > 0) {
          moveX = (dx / dist) * enemy.speed;
          moveY = (dy / dist) * enemy.speed;
        }
      } else if (enemy.type === 'SHOOTER') {
        // Keep distance logic
        const range = enemy.attackRange || ENEMY_SHOOTER_RANGE;
        
        // If too far, approach
        if (dist > range + 50) {
           moveX = (dx / dist) * enemy.speed;
           moveY = (dy / dist) * enemy.speed;
        } 
        // If too close, retreat
        else if (dist < range - 50) {
           moveX = -(dx / dist) * enemy.speed;
           moveY = -(dy / dist) * enemy.speed;
        }
        // Otherwise stop/strafe (stationary for now)
        
        // Shooting Logic
        if (enemy.lastFired !== undefined && enemy.fireRate) {
          enemy.lastFired += dt;
          if (enemy.lastFired >= 1 / enemy.fireRate) {
            this.fireEnemyBullet(enemy);
            enemy.lastFired = 0;
          }
        }
      }

      enemy.vx = moveX;
      enemy.vy = moveY;

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

      if (enemy.hitTimer && enemy.hitTimer > 0) {
        enemy.hitTimer -= dt;
      }

      // Simple separation logic to prevent stacking
      for (const other of this.enemies) {
        if (enemy === other) continue;
        if (this.checkCollision(enemy, other)) {
            const pushX = enemy.x - other.x;
            const pushY = enemy.y - other.y;
            const len = Math.sqrt(pushX * pushX + pushY * pushY);
            if (len > 0) {
              eFinalX += (pushX / len) * 1;
              eFinalY += (pushY / len) * 1;
            }
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

      // Collision handling
      if (!b.markedForDeletion) {
        if (b.isEnemy) {
          // Enemy bullet vs Player
          if (this.player && !this.player.isInvulnerable && this.player.invulnerabilityTimer <= 0 && this.checkCollision(b, this.player)) {
            this.player.hp -= b.damage;
            this.player.invulnerabilityTimer = 1.0;
            b.markedForDeletion = true;
            if (this.player.hp <= 0) {
              this.player.hp = 0;
            }
          }
        } else {
          // Player bullet vs Enemies
          // console.log('Checking collision for bullet', b.id, 'vs', this.enemies.length, 'enemies');
          for (const enemy of this.enemies) {
            if (this.checkCollision(b, enemy)) {
              // console.log('Collision detected!');
              enemy.hp -= b.damage;
              enemy.hitTimer = 0.1; // Flash for 100ms
              b.markedForDeletion = true;
              if (enemy.hp <= 0) {
                enemy.markedForDeletion = true;
              }
              break;
            }
          }
        }
      }

      if (b.markedForDeletion) {
        this.bullets.splice(i, 1);
      }
    }

    // Cleanup dead enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].markedForDeletion) {
        this.enemies.splice(i, 1);
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
      markedForDeletion: false,
      isEnemy: false
    });
  }

  fireEnemyBullet(enemy: Enemy) {
    if (!this.player) return;
    
    const dx = this.player.x - enemy.x;
    const dy = this.player.y - enemy.y;
    const angle = Math.atan2(dy, dx);
    
    const speed = enemy.bulletSpeed || ENEMY_SHOOTER_BULLET_SPEED;
    
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    this.bullets.push({
      id: Math.random().toString(),
      x: enemy.x,
      y: enemy.y,
      width: ENEMY_SHOOTER_BULLET_SIZE,
      height: ENEMY_SHOOTER_BULLET_SIZE,
      color: ENEMY_SHOOTER_BULLET_COLOR,
      vx,
      vy,
      damage: enemy.damage,
      markedForDeletion: false,
      isEnemy: true
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
      if (enemy.hitTimer && enemy.hitTimer > 0) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = enemy.color;
      }
      ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
      
      // Draw health bar for enemies
      const hpPercent = enemy.hp / enemy.maxHp;
      ctx.fillStyle = 'red';
      ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2 - 10, enemy.width, 4);
      ctx.fillStyle = 'green';
      ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2 - 10, enemy.width * hpPercent, 4);
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
      if (this.player.invulnerabilityTimer > 0) {
        if (Math.floor(this.player.invulnerabilityTimer * 10) % 2 === 0) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = this.player.color;
        }
      } else {
        ctx.fillStyle = this.player.color;
      }
      ctx.fillRect(-this.player.width / 2, -this.player.height / 2, this.player.width, this.player.height);
      
      // Gun/Pointer
      ctx.fillStyle = '#fff';
      ctx.fillRect(10, -4, 20, 8); // Stick out to the right

      ctx.restore();
    }
  }
}
