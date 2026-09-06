import * as THREE from 'three';
import { GameEngine } from './engine/GameEngine';
import { AudioManager } from './audio/AudioManager';
import { EffectSystem } from './effects/EffectSystem';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gameEngine = new GameEngine(canvas);
const audioManager = new AudioManager();

// Initialize and start the game
console.log('🎮 Fantasy Battle Arena - Loading...');

gameEngine.initialize();
audioManager.playBattleTheme();
gameEngine.start();

console.log('✅ Game Started! Use mouse or touch to control camera');
console.log('⚔️ Select actions to attack enemies');

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.key === 'm' || event.key === 'M') {
        audioManager.toggleMute();
    }
    if (event.key === '1') {
        document.getElementById('attackBtn')?.click();
    }
    if (event.key === '2') {
        document.getElementById('magicBtn')?.click();
    }
    if (event.key === '3') {
        document.getElementById('defenseBtn')?.click();
    }
    if (event.key === '4') {
        document.getElementById('itemBtn')?.click();
    }
});
