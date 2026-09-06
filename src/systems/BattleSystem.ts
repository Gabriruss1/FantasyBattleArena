import { Character } from './Character';
import { CharacterManager } from './CharacterManager';
import gsap from 'gsap';

export class BattleSystem {
    private characterManager: CharacterManager;
    private currentTurn: Character | null = null;
    private turnQueue: Character[] = [];
    private isBattleActive: boolean = true;
    private battleLog: string[] = [];
    private selectedAction: string = 'attack';

    constructor(characterManager: CharacterManager) {
        this.characterManager = characterManager;
        this.initializeTurnOrder();
        this.setupEventListeners();
    }

    private initializeTurnOrder(): void {
        this.turnQueue = this.characterManager.getAllCharacters().sort((a, b) => b.stats.speed - a.stats.speed);
        this.currentTurn = this.turnQueue[0];
    }

    private setupEventListeners(): void {
        document.getElementById('attackBtn')?.addEventListener('click', () => this.executePlayerAction('attack'));
        document.getElementById('magicBtn')?.addEventListener('click', () => this.executePlayerAction('magic'));
        document.getElementById('defenseBtn')?.addEventListener('click', () => this.executePlayerAction('defense'));
        document.getElementById('itemBtn')?.addEventListener('click', () => this.executePlayerAction('item'));
    }

    public executePlayerAction(action: string): void {
        const player = this.characterManager.getPlayerCharacter();
        if (!player || this.currentTurn !== player) return;

        let damage = 0;
        let targetEnemy = this.characterManager.getEnemies()[0];

        if (!targetEnemy || !targetEnemy.isAlive) return;

        switch (action) {
            case 'attack':
                damage = player.stats.attack + Math.random() * 10 - 5;
                player.playAttackAnimation();
                this.addLog(`${player.name} ha attaccato ${targetEnemy.name}!`, 'damage');
                break;

            case 'magic':
                if (player.useMp(15)) {
                    damage = player.stats.attack * 2;
                    player.playMagicAnimation('fire');
                    this.addLog(`${player.name} ha lanciato Fuoco!`, 'magic');
                } else {
                    this.addLog(`${player.name} non ha abbastanza MP!`, 'damage');
                    return;
                }
                break;

            case 'defense':
                player.stats.defense += 5;
                this.addLog(`${player.name} si è messo in difesa!`, 'heal');
                break;

            case 'item':
                player.heal(30);
                player.playMagicAnimation('heal');
                this.addLog(`${player.name} ha usato una pozione!`, 'heal');
                break;
        }

        if (damage > 0 && targetEnemy) {
            targetEnemy.takeDamage(damage);
            if (!targetEnemy.isAlive) {
                this.addLog(`${targetEnemy.name} è stato sconfitto!`, 'magic');
            }
        }

        this.nextTurn();
    }

    private nextTurn(): void {
        const currentIndex = this.turnQueue.indexOf(this.currentTurn!);
        const nextIndex = (currentIndex + 1) % this.turnQueue.length;
        this.currentTurn = this.turnQueue[nextIndex];

        // Remove dead characters
        this.characterManager.removeDeadCharacters();
        this.turnQueue = this.turnQueue.filter(c => c.isAlive);

        if (this.turnQueue.length === 0) {
            this.endBattle();
            return;
        }

        // Check if current turn is an enemy
        if (this.characterManager.getEnemies().includes(this.currentTurn!)) {
            this.executeEnemyTurn();
        }
    }

    private executeEnemyTurn(): void {
        const enemy = this.currentTurn as Character;
        const player = this.characterManager.getPlayerCharacter();

        if (!player || !player.isAlive) return;

        setTimeout(() => {
            const actionType = Math.random() > 0.6 ? 'magic' : 'attack';
            let damage = 0;

            if (actionType === 'magic' && enemy.useMp(10)) {
                damage = enemy.stats.attack * 1.8;
                enemy.playMagicAnimation('fire');
                this.addLog(`${enemy.name} ha lanciato una magia!`, 'magic');
            } else {
                damage = enemy.stats.attack + Math.random() * 8 - 4;
                enemy.playAttackAnimation();
                this.addLog(`${enemy.name} ha attaccato!`, 'damage');
            }

            player.takeDamage(damage);
            if (!player.isAlive) {
                this.addLog(`${player.name} è stato sconfitto!`, 'damage');
            }

            this.nextTurn();
        }, 1000);
    }

    private endBattle(): void {
        this.isBattleActive = false;
        const player = this.characterManager.getPlayerCharacter();
        if (player?.isAlive) {
            this.addLog('Vittoria! Hai sconfitto tutti i nemici!', 'heal');
        } else {
            this.addLog('Game Over! Sei stato sconfitto!', 'damage');
        }
    }

    public addLog(message: string, type: 'damage' | 'heal' | 'magic' = 'damage'): void {
        this.battleLog.push(message);
        const logElement = document.getElementById('battleLog');
        if (logElement) {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.textContent = message;
            logElement.appendChild(entry);
            logElement.scrollTop = logElement.scrollHeight;
        }
    }

    public update(): void {
        // Update logic here
    }

    public isBattleOver(): boolean {
        return !this.isBattleActive;
    }

    public getCurrentTurn(): Character | null {
        return this.currentTurn;
    }

    public getTurnQueue(): Character[] {
        return this.turnQueue;
    }
}
