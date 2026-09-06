import * as THREE from 'three';

export class SceneBuilder {
    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public buildEnvironment(): void {
        // Create ground with grid pattern
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a3a52,
            roughness: 0.8,
            metalness: 0.1,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add grid lines
        const gridHelper = new THREE.GridHelper(100, 20, 0x00d9ff, 0x1a1f3a);
        (gridHelper.material as THREE.LineBasicMaterial).opacity = 0.2;
        (gridHelper.material as THREE.LineBasicMaterial).transparent = true;
        this.scene.add(gridHelper);

        // Add fog effect
        this.scene.fog = new THREE.Fog(0x0a0e27, 150, 300);
    }

    public buildLighting(): void {
        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(50, 80, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -60;
        sunLight.shadow.camera.right = 60;
        sunLight.shadow.camera.top = 60;
        sunLight.shadow.camera.bottom = -60;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 200;
        this.scene.add(sunLight);

        // Ambient light for fill
        const ambientLight = new THREE.AmbientLight(0x00d9ff, 0.4);
        this.scene.add(ambientLight);

        // Neon blue light
        const neonLight1 = new THREE.PointLight(0x00d9ff, 2, 100);
        neonLight1.position.set(-30, 15, 0);
        this.scene.add(neonLight1);

        // Neon purple light
        const neonLight2 = new THREE.PointLight(0xc700eb, 1.5, 100);
        neonLight2.position.set(30, 15, 0);
        this.scene.add(neonLight2);

        // Back light for depth
        const backLight = new THREE.DirectionalLight(0x39ff14, 0.5);
        backLight.position.set(-50, 30, -50);
        this.scene.add(backLight);
    }

    public addEnvironmentDetails(): void {
        // Add pillars
        const pillarGeometry = new THREE.CylinderGeometry(2, 2, 8, 16);
        const pillarMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1f3a,
            emissive: 0x00d9ff,
        });

        const pillarPositions = [
            [-30, 0, -20],
            [30, 0, -20],
            [-30, 0, 20],
            [30, 0, 20],
        ];

        pillarPositions.forEach(pos => {
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(pos[0], pos[1], pos[2]);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.scene.add(pillar);
        });

        // Add animated orbs
        for (let i = 0; i < 5; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00d9ff : 0xc700eb,
                emissive: i % 2 === 0 ? 0x00d9ff : 0xc700eb,
            });
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(
                (Math.random() - 0.5) * 60,
                15 + Math.random() * 10,
                (Math.random() - 0.5) * 60
            );

            // Store position for animation
            (orb as any).originalY = orb.position.y;
            (orb as any).floatSpeed = 0.5 + Math.random() * 1;

            this.scene.add(orb);
        }
    }
}
