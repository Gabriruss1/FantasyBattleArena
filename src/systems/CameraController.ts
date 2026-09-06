import * as THREE from 'three';

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private targetPosition: THREE.Vector3;
    private targetLookAt: THREE.Vector3;
    private cameraDistance: number = 40;
    private cameraHeight: number = 25;
    private orbitAngle: number = 0;

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        this.targetPosition = new THREE.Vector3();
        this.targetLookAt = new THREE.Vector3(0, 5, 0);

        this.setupMouseControls();
        this.setupTouchControls();
    }

    private setupMouseControls(): void {
        document.addEventListener('mousemove', (event) => {
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            this.orbitAngle = x * Math.PI;
        });
    }

    private setupTouchControls(): void {
        document.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            const x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.orbitAngle = x * Math.PI;
        });
    }

    public update(): void {
        // Smooth camera orbiting
        this.targetPosition.x = Math.cos(this.orbitAngle) * this.cameraDistance;
        this.targetPosition.y = this.cameraHeight;
        this.targetPosition.z = Math.sin(this.orbitAngle) * this.cameraDistance;

        this.camera.position.lerp(this.targetPosition, 0.05);
        this.camera.lookAt(this.targetLookAt);
    }

    public setCameraAngle(angle: number): void {
        this.orbitAngle = angle;
    }

    public zoomIn(): void {
        this.cameraDistance = Math.max(20, this.cameraDistance - 2);
    }

    public zoomOut(): void {
        this.cameraDistance = Math.min(60, this.cameraDistance + 2);
    }
}
