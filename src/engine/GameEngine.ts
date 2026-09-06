import * as THREE from 'three';
import gsap from 'gsap';
import { Character } from './systems/Character';
import { CharacterManager } from './systems/CharacterManager';
import { UIManager } from './systems/UIManager';
import { CameraController } from './systems/CameraController';
import { SceneBuilder } from './scenes/SceneBuilder';
import { BattleSystem } from './systems/BattleSystem';
import { AudioManager } from './audio/AudioManager';
import { EffectSystem } from './effects/EffectSystem';

/**
 * Main GameEngine class - orchestrates all game systems
 * Handles: Rendering, game loop, system initialization, update coordination
 */
export class GameEngine {
    private canvas: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private battleSystem: BattleSystem;
    private characterManager: CharacterManager;
    private uiManager: UIManager;
    private cameraController: CameraController;
    private sceneBuilder: SceneBuilder;
    private effectSystem: EffectSystem;
    private audioManager: AudioManager;
    private isRunning: boolean = false;
    private frameCount: number = 0;
    private fps: number = 0;
    private lastTime: number = Date.now();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 100, 300);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(30, 30, 30);

        // Setup renderer with optimization flags
        this.renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            precision: 'highp',
            stencil: false,
            depth: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.renderer.shadowMap.autoUpdate = true;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        // Initialize game systems
        this.characterManager = new CharacterManager();
        this.battleSystem = new BattleSystem(this.characterManager);
        this.uiManager = new UIManager(this.battleSystem);
        this.cameraController = new CameraController(this.camera);
        this.sceneBuilder = new SceneBuilder(this.scene);
        this.effectSystem = new EffectSystem(this.scene);
        this.audioManager = new AudioManager();

        // Setup event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('keydown', (e) => this.onKeyDown(e));

        console.log('🎮 GameEngine initialized');
    }

    /**
     * Initialize game world, characters, and UI
     */
    public initialize(): void {
        console.log('⚙️ Initializing game world...');

        // Build scene
        this.sceneBuilder.buildEnvironment();
        this.sceneBuilder.buildLighting();
        this.sceneBuilder.addEnvironmentDetails();

        // Create player
        const player = this.characterManager.createPlayer('Cloud', 150, 80, 20);
        this.scene.add(player.model);

        // Create enemies
        const enemy1 = this.characterManager.createEnemy('Phantom', 80, 30, 12);
        const enemy2 = this.characterManager.createEnemy('Shadow', 70, 25, 10);
        this.scene.add(enemy1.model);
        this.scene.add(enemy2.model);

        // Initialize UI
        this.uiManager.initialize();
        this.uiManager.updateHUD(player, [enemy1, enemy2]);

        // Start audio
        this.audioManager.playBattleTheme();

        console.log('✅ Game world ready! Battle start!');
        this.logGameStats();
    }

    /**
     * Start the game loop
     */
    public start(): void {
        this.isRunning = true;
        console.log('🚀 Game loop started');
        this.animate();
    }

    /**
     * Main animation/update loop
     */
    private animate = (): void => {
        if (!this.isRunning) return;

        requestAnimationFrame(this.animate);

        // Update systems
        this.battleSystem.update();
        this.cameraController.update();

        // Update UI
        const player = this.characterManager.getPlayerCharacter();
        const enemies = this.characterManager.getEnemies();
        
        if (player) {
            this.uiManager.updateHUD(player, enemies);
            this.uiManager.updateMiniMap(player, enemies);
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);

        // Update FPS counter
        this.updateFPS();
    };

    /**
     * Calculate and display FPS
     */
    private updateFPS(): void {
        this.frameCount++;
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            console.log(`📊 FPS: ${this.fps}`);
        }
    }

    /**
     * Handle window resize events
     */
    private onWindowResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    /**
     * Handle keyboard input
     */
    private onKeyDown(event: KeyboardEvent): void {
        switch (event.key.toLowerCase()) {
            case 'm':
                this.audioManager.toggleMute();
                break;
            case '1':
                this.battleSystem.executePlayerAction('attack');
                break;
            case '2':
                this.battleSystem.executePlayerAction('magic');
                break;
            case '3':
                this.battleSystem.executePlayerAction('defense');
                break;
            case '4':
                this.battleSystem.executePlayerAction('item');
                break;
            case 'escape':
                this.pauseGame();
                break;
        }
    }

    /**
     * Pause the game (future feature)
     */
    private pauseGame(): void {
        this.isRunning = false;
        console.log('⏸️ Game paused');
    }

    /**
     * Resume the game
     */
    public resumeGame(): void {
        this.isRunning = true;
        console.log('▶️ Game resumed');
    }

    /**
     * Log game statistics to console
     */
    private logGameStats(): void {
        const stats = {
            scene: {
                children: this.scene.children.length,
                fog: this.scene.fog ? 'enabled' : 'disabled',
            },
            renderer: {
                pixelRatio: this.renderer.getPixelRatio(),
                shadowMapEnabled: this.renderer.shadowMap.enabled,
            },
            camera: {
                position: {
                    x: this.camera.position.x.toFixed(2),
                    y: this.camera.position.y.toFixed(2),
                    z: this.camera.position.z.toFixed(2),
                },
                fov: this.camera.fov,
            },
            characters: {
                player: this.characterManager.getPlayerCharacter()?.name,
                enemies: this.characterManager.getEnemies().length,
            },
        };

        console.table(stats);
    }

    /**
     * Get current FPS
     */
    public getFPS(): number {
        return this.fps;
    }

    /**
     * Check if game is running
     */
    public isGameRunning(): boolean {
        return this.isRunning;
    }

    /**
     * Get effect system for particle effects
     */
    public getEffectSystem(): EffectSystem {
        return this.effectSystem;
    }

    /**
     * Get audio manager for sound control
     */
    public getAudioManager(): AudioManager {
        return this.audioManager;
    }

    /**
     * Get battle system for combat control
     */
    public getBattleSystem(): BattleSystem {
        return this.battleSystem;
    }

    /**
     * Get character manager for character access
     */
    public getCharacterManager(): CharacterManager {
        return this.characterManager;
    }

    /**
     * Cleanup and destroy engine (for page unload)
     */
    public destroy(): void {
        this.isRunning = false;
        window.removeEventListener('resize', () => this.onWindowResize());
        this.renderer.dispose();
        console.log('🛑 GameEngine destroyed');
    }
}
