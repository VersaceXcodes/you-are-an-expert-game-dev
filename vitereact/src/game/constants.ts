export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;

export const WALL_THICKNESS = 50;
export const ARENA_X = WALL_THICKNESS;
export const ARENA_Y = WALL_THICKNESS;
export const ARENA_WIDTH = CANVAS_WIDTH - (WALL_THICKNESS * 2);
export const ARENA_HEIGHT = CANVAS_HEIGHT - (WALL_THICKNESS * 2);

export const PLAYER_BASE_SPEED = 300;
export const PLAYER_DASH_SPEED = 900;
export const PLAYER_DASH_DURATION = 0.25;
export const PLAYER_DASH_COOLDOWN = 2.5;
export const PLAYER_MAX_HP = 100;

export const ENEMY_CHASER_HP = 30;
export const ENEMY_CHASER_SPEED = 150;
export const ENEMY_CHASER_DAMAGE = 10;
export const ENEMY_CHASER_SIZE = 32;
export const ENEMY_CHASER_COLOR = '#ff0000';

export const ENEMY_SHOOTER_HP = 20;
export const ENEMY_SHOOTER_SPEED = 100;
export const ENEMY_SHOOTER_DAMAGE = 10;
export const ENEMY_SHOOTER_SIZE = 28;
export const ENEMY_SHOOTER_COLOR = '#ff00ff';
export const ENEMY_SHOOTER_RANGE = 400; // Keep this distance
export const ENEMY_SHOOTER_FIRE_RATE = 0.5; // Shots per second
export const ENEMY_SHOOTER_BULLET_SPEED = 200; // Slow bullets
export const ENEMY_SHOOTER_BULLET_SIZE = 12;
export const ENEMY_SHOOTER_BULLET_COLOR = '#ff00ff';

export const WAVE_INTERVAL = 10; // Seconds between waves (placeholder)
