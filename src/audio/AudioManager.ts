import { Howl } from 'howler';

export class AudioManager {
    private sounds: Map<string, Howl> = new Map();
    private isMuted: boolean = false;

    constructor() {
        this.initializeSounds();
    }

    private initializeSounds(): void {
        // Battle theme - using data URI for self-contained audio
        this.sounds.set('battle_theme', new Howl({
            src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
            loop: true,
            volume: 0.5,
        }));

        // Attack sound
        this.sounds.set('attack', new Howl({
            src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
            volume: 0.7,
        }));

        // Magic sound
        this.sounds.set('magic', new Howl({
            src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
            volume: 0.6,
        }));

        // Heal sound
        this.sounds.set('heal', new Howl({
            src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
            volume: 0.6,
        }));

        // Victory sound
        this.sounds.set('victory', new Howl({
            src: ['data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='],
            volume: 0.7,
        }));
    }

    public playSound(soundName: string): void {
        if (this.isMuted) return;
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.play();
        }
    }

    public playBattleTheme(): void {
        const theme = this.sounds.get('battle_theme');
        if (theme && !this.isMuted) {
            theme.play();
        }
    }

    public stopBattleTheme(): void {
        const theme = this.sounds.get('battle_theme');
        if (theme) {
            theme.stop();
        }
    }

    public toggleMute(): void {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
    }

    public setVolume(volume: number): void {
        Howler.volume(Math.max(0, Math.min(1, volume)));
    }
}
