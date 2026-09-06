import { Character } from './Character';
import * as THREE from 'three';

export class Boss extends Character {
    public phase: number = 1;
    private maxPhases: number = 3;
    private phaseChangeThreshold: number = 0.66;

    constructor(name: string, hp: number, mp: number, attack: number) {
        super(name, hp, mp, attack, 15);
        this.stats.level = 99;
        this.setupBossAbilities();
        this.createBossModel();
    }

    private setupBossAbilities(): void {
        this.abilities = [
            {
                name: 'Power Strike',
                mpCost: 0,
                damage: this.stats.attack * 2.5,
                type: 'physical',
                animation: 'power_strike',
            },
            {
                name: 'Meteor',
                mpCost: 40,
                damage: this.stats.attack * 3,
                type: 'magic',
                animation: 'meteor',
            },
            {
                name: 'Dark Wave',
                mpCost: 50,
                damage: this.stats.attack * 4,
                type: 'magic',
                animation: 'dark_wave',
            },
            {
                name: 'Regenerate',
                mpCost: 30,
                damage: -this.stats.maxHp * 0.25,
                type: 'heal',
                animation: 'regenerate',
            },
        ];
    }

    private createBossModel(): void {
        // Clear default model
        this.model.clear();

        // Create boss body
        const bodyGeometry = new THREE.ConeGeometry(1.5, 4, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x8b0000,
            emissive: 0xc700eb,
            shininess: 200,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;

        // Create boss head
        const headGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xff4444,
            emissive: 0xc700eb,
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.5;
        head.castShadow = true;

        // Create glowing eyes
        const eyeGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 2.8, 0.6);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 2.8, 0.6);

        // Create boss aura
        const auraGeometry = new THREE.SphereGeometry(4, 16, 16);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0xc700eb,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide,
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);

        // Create horn
        const hornGeometry = new THREE.ConeGeometry(0.3, 2, 8);
        const hornMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd700,
            emissive: 0xffaa00,
        });
        const horn = new THREE.Mesh(hornGeometry, hornMaterial);
        horn.position.set(0, 3.5, 0);
        horn.castShadow = true;

        this.model.add(body, head, leftEye, rightEye, aura, horn);
        this.model.position.copy(this.position);
    }

    public checkPhaseChange(): void {
        const hpPercent = this.stats.hp / this.stats.maxHp;
        const newPhase = Math.ceil((1 - hpPercent) * this.maxPhases) + 1;

        if (newPhase > this.phase) {
            this.phase = newPhase;
            this.onPhaseChange();
        }
    }

    private onPhaseChange(): void {
        this.playPhaseChangeAnimation();
        console.log(`🔥 Boss entered Phase ${this.phase}!`);

        // Increase stats based on phase
        this.stats.attack *= 1.2;
        this.stats.defense += 5;
    }

    public playPhaseChangeAnimation(): void {
        const originalColor = this.model.children[0] instanceof THREE.Mesh
            ? (this.model.children[0] as THREE.Mesh).material
            : null;

        if (originalColor) {
            const material = originalColor as THREE.MeshPhongMaterial;
            const originalEmissive = material.emissive.getHex();

            // Flash animation
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    material.emissive.setHex(0xffff00);
                }, i * 200);
                setTimeout(() => {
                    material.emissive.setHex(originalEmissive);
                }, i * 200 + 100);
            }
        }
    }

    public getBossAbility(): string {
        const phaseAbilities: Record<number, string> = {
            1: 'Power Strike',
            2: 'Meteor',
            3: 'Dark Wave',
        };

        return phaseAbilities[this.phase] || 'Power Strike';
    }
}
