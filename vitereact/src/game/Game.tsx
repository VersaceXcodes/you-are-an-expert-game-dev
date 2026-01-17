import React, { useEffect, useRef, useState } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { GameState } from './types';
import { GameLogic } from './GameLogic';
import { InputManager } from './InputManager';
import MainMenu from './ui/MainMenu';
import MetaMenu from './ui/MetaMenu';
import SettingsMenu from './ui/SettingsMenu';
import HUD from './ui/HUD';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp, setPlayerMaxHp] = useState(100);
  
  // Use refs to keep persistent game objects
  const gameLogicRef = useRef<GameLogic | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);
  
  // Refs to track last synced values to avoid excessive re-renders
  const lastHpRef = useRef(100);
  const lastMaxHpRef = useRef(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize systems
    if (!gameLogicRef.current) {
      gameLogicRef.current = new GameLogic();
    }
    if (!inputManagerRef.current) {
      inputManagerRef.current = new InputManager();
    }

    const game = gameLogicRef.current;
    const input = inputManagerRef.current;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Sync state from React to Game (for Start button)
      // Actually, better to sync Game to React
      // But we need to handle "Start" button click.
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const mouseX = (input.mouse.x - rect.left) * scaleX;
      const mouseY = (input.mouse.y - rect.top) * scaleY;

      // Update
      game.update(dt, input, mouseX, mouseY);
      
      // Draw
      game.draw(ctx);

      // Sync state back to React if changed
      if (game.state !== gameState) {
        setGameState(game.state);
      }

      // Sync player stats for UI
      if (game.player) {
        const currentHp = Math.ceil(game.player.hp);
        const currentMaxHp = game.player.maxHp;
        
        if (currentHp !== lastHpRef.current || currentMaxHp !== lastMaxHpRef.current) {
          setPlayerHp(currentHp);
          setPlayerMaxHp(currentMaxHp);
          lastHpRef.current = currentHp;
          lastMaxHpRef.current = currentMaxHp;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      input.destroy();
      inputManagerRef.current = null; // Clean up input manager
    };
  }, []); // Run once on mount

  // Handle external state changes (UI interactions)
  useEffect(() => {
    if (gameLogicRef.current) {
      gameLogicRef.current.state = gameState;
      if (gameState === 'RUN' && gameLogicRef.current.player?.hp === 0) {
        // Reset if starting fresh run
        gameLogicRef.current.reset();
      }
    }
  }, [gameState]);

  const handleStartGame = () => {
    if (gameLogicRef.current) gameLogicRef.current.reset();
    setGameState('RUN');
  };

  const handleQuit = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-gray-700 shadow-2xl bg-black block"
        />
        
        {gameState === 'MENU' && (
          <MainMenu 
            onStart={handleStartGame}
            onUpgrades={() => setGameState('META_MENU')}
            onSettings={() => setGameState('SETTINGS')}
            onQuit={handleQuit}
          />
        )}

        {gameState === 'RUN' && (
          <HUD hp={playerHp} maxHp={playerMaxHp} />
        )}

        {gameState === 'META_MENU' && (
          <MetaMenu onBack={() => setGameState('MENU')} />
        )}

        {gameState === 'SETTINGS' && (
          <SettingsMenu onBack={() => setGameState('MENU')} />
        )}
      </div>
    </div>
  );
};

export default Game;
