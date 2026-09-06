import * as THREE from 'three';
import gsap from 'gsap';

export class EffectSystem {
    private scene: THREE.Scene;
    private particleMeshes: THREE.Mesh[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public createExplosion(position: THREE.Vector3, color: number = 0xff6600): void {
        const particleCount = 30;
        const particles: THREE.Mesh[] = [];

        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.3, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                emissive: color,
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);

            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                Math.random() * 6 + 2,
                (Math.random() - 0.5) * 8
            );

            this.scene.add(particle);
            particles.push(particle);

            gsap.to(particle.position, {
                x: particle.position.x + velocity.x,
                y: particle.position.y + velocity.y,
                z: particle.position.z + velocity.z,
                duration: 1.2,
                ease: 'power2.out',
            });

            gsap.to(particle.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.2,
                ease: 'power2.out',
                onComplete: () => {
                    this.scene.remove(particle);
                },
            });

            gsap.to(material, {
                opacity: 0,
                duration: 1.2,
            });
        }
    }

    public createSlashEffect(position: THREE.Vector3, direction: THREE.Vector3): void {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -1, -0.5, 0,
            1, -0.5, 0,
            1, 0.5, 0,
            -1, 0.5, 0,
        ]);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0x00d9ff,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
        });

        const slash = new THREE.Mesh(geometry, material);
        slash.position.copy(position);
        slash.rotation.z = Math.atan2(direction.y, direction.x);

        this.scene.add(slash);

        gsap.to(material, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.scene.remove(slash);
            },
        });

        gsap.to(slash.scale, {
            x: 0.5,
            duration: 0.5,
        });
    }

    public createHealingAura(position: THREE.Vector3): void {
        const geometry = new THREE.TorusGeometry(2, 0.3, 8, 50);
        const material = new THREE.MeshBasicMaterial({
            color: 0x39ff14,
            emissive: 0x39ff14,
            transparent: true,
            opacity: 0.7,
        });

        const aura = new THREE.Mesh(geometry, material);
        aura.position.copy(position);
        aura.position.y += 2;

        this.scene.add(aura);

        gsap.to(aura.scale, {
            x: 2,
            y: 2,
            z: 2,
            duration: 0.8,
            ease: 'back.out',
        });

        gsap.to(aura.rotation, {
            z: Math.PI * 2,
            duration: 1,
        });

        gsap.to(material, {
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            onComplete: () => {
                this.scene.remove(aura);
            },
        });
    }

    public createLightning(from: THREE.Vector3, to: THREE.Vector3): void {
        const points = [from.clone()];
        const segments = 10;

        for (let i = 1; i < segments; i++) {
            const point = from.clone().lerp(to, i / segments);
            point.x += (Math.random() - 0.5) * 2;
            point.y += (Math.random() - 0.5) * 2;
            point.z += (Math.random() - 0.5) * 2;
            points.push(point);
        }
        points.push(to.clone());

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xffff00,
            linewidth: 3,
        });

        const lightning = new THREE.Line(geometry, material);
        this.scene.add(lightning);

        gsap.to(material, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this.scene.remove(lightning);
            },
        });
    }

    public createDamageIndicator(position: THREE.Vector3, damage: number): void {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;

        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(Math.floor(damage).toString(), 128, 80);

        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(2, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(position);
        mesh.position.y += 3;

        this.scene.add(mesh);

        gsap.to(mesh.position, {
            y: mesh.position.y + 3,
            duration: 1,
            ease: 'power2.out',
        });

        gsap.to(material, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.scene.remove(mesh);
            },
        });
    }
}
