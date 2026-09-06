export interface GameState {
    isRunning: boolean;
    isPaused: boolean;
    currentBattle: BattleState | null;
    player: PlayerState | null;
    enemies: EnemyState[];
    gamePhase: 'menu' | 'battle' | 'victory' | 'defeat' | 'pause';
}

export interface BattleState {
    round: number;
    currentTurn: string; // Character ID
    turnOrder: string[];
    combatLog: CombatLog[];
    battleActive: boolean;
}

export interface PlayerState {
    id: string;
    name: string;
    level: number;
    experience: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    stats: CharacterStats;
    inventory: InventoryState;
    equipment: EquipmentState;
}

export interface EnemyState {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    stats: CharacterStats;
    loot: LootTable;
}

export interface CharacterStats {
    attack: number;
    defense: number;
    speed: number;
    magicDefense: number;
    critRate: number;
    dodgeRate: number;
}

export interface InventoryState {
    maxSlots: number;
    items: InventoryItem[];
}

export interface InventoryItem {
    id: string;
    quantity: number;
}

export interface EquipmentState {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
    shield: string | null;
}

export interface CombatLog {
    timestamp: number;
    attacker: string;
    defender: string;
    action: string;
    damage: number;
    isCritical: boolean;
}

export interface LootTable {
    gold: number;
    experience: number;
    items: LootItem[];
}

export interface LootItem {
    itemId: string;
    dropRate: number;
}

/**
 * GameStateManager - Centralized state management for the entire game
 * Handles: Game state, save/load, state persistence
 */
export class GameStateManager {
    private gameState: GameState;
    private saveSlots: GameState[] = [];
    private maxSaveSlots: number = 3;

    constructor() {
        this.gameState = this.initializeGameState();
        this.loadSaveSlots();
    }

    private initializeGameState(): GameState {
        return {
            isRunning: false,
            isPaused: false,
            currentBattle: null,
            player: null,
            enemies: [],
            gamePhase: 'menu',
        };
    }

    public setGameState(state: GameState): void {
        this.gameState = state;
        this.persistState();
    }

    public getGameState(): GameState {
        return { ...this.gameState };
    }

    public updatePlayerState(playerState: PlayerState): void {
        this.gameState.player = playerState;
        this.persistState();
    }

    public updateBattleState(battleState: BattleState): void {
        this.gameState.currentBattle = battleState;
        this.persistState();
    }

    public setGamePhase(phase: GameState['gamePhase']): void {
        this.gameState.gamePhase = phase;
        console.log(`📍 Game phase changed to: ${phase}`);
    }

    public saveGame(slotNumber: number): boolean {
        if (slotNumber < 0 || slotNumber >= this.maxSaveSlots) {
            console.error('Invalid save slot');
            return false;
        }

        this.saveSlots[slotNumber] = { ...this.gameState };
        this.persistSaveSlots();
        console.log(`💾 Game saved to slot ${slotNumber + 1}`);
        return true;
    }

    public loadGame(slotNumber: number): boolean {
        if (slotNumber < 0 || slotNumber >= this.maxSaveSlots) {
            console.error('Invalid save slot');
            return false;
        }

        const savedState = this.saveSlots[slotNumber];
        if (!savedState) {
            console.error('No save found in slot');
            return false;
        }

        this.gameState = { ...savedState };
        console.log(`📂 Game loaded from slot ${slotNumber + 1}`);
        return true;
    }

    public getSaveSlots(): (GameState | null)[] {
        return this.saveSlots.map(slot => slot || null);
    }

    public isSaveSlotEmpty(slotNumber: number): boolean {
        return !this.saveSlots[slotNumber];
    }

    private persistState(): void {
        try {
            const stateJSON = JSON.stringify(this.gameState);
            localStorage.setItem('fantasyBattleArena_gameState', stateJSON);
        } catch (error) {
            console.error('Failed to persist game state:', error);
        }
    }

    private persistSaveSlots(): void {
        try {
            const slotsJSON = JSON.stringify(this.saveSlots);
            localStorage.setItem('fantasyBattleArena_saveSlots', slotsJSON);
        } catch (error) {
            console.error('Failed to persist save slots:', error);
        }
    }

    private loadSaveSlots(): void {
        try {
            const slotsJSON = localStorage.getItem('fantasyBattleArena_saveSlots');
            if (slotsJSON) {
                this.saveSlots = JSON.parse(slotsJSON);
            }
        } catch (error) {
            console.error('Failed to load save slots:', error);
            this.saveSlots = Array(this.maxSaveSlots).fill(null);
        }
    }

    public resetGame(): void {
        this.gameState = this.initializeGameState();
        this.persistState();
        console.log('🔄 Game reset to initial state');
    }

    public getProgress(): { currentPhase: string; enemiesDefeated: number } {
        return {
            currentPhase: this.gameState.gamePhase,
            enemiesDefeated: this.gameState.enemies.filter(e => e.hp <= 0).length,
        };
    }
}
