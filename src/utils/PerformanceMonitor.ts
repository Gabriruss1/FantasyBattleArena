/**
 * Performance monitoring and analytics system
 * Tracks FPS, memory usage, and game metrics
 */
export class PerformanceMonitor {
    private fps: number = 0;
    private frameCount: number = 0;
    private lastTime: number = Date.now();
    private memoryUsage: number = 0;
    private metrics: Map<string, number> = new Map();
    private isEnabled: boolean = false;

    constructor(enableAutoReport: boolean = false) {
        this.isEnabled = enableAutoReport;
        if (enableAutoReport) {
            setInterval(() => this.reportMetrics(), 5000);
        }
    }

    /**
     * Update FPS counter
     */
    public updateFrame(): void {
        this.frameCount++;
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            this.updateMemoryUsage();
        }
    }

    /**
     * Get current FPS
     */
    public getFPS(): number {
        return this.fps;
    }

    /**
     * Update memory usage from performance API
     */
    private updateMemoryUsage(): void {
        if (performance.memory) {
            this.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
        }
    }

    /**
     * Get current memory usage in MB
     */
    public getMemoryUsage(): number {
        return this.memoryUsage;
    }

    /**
     * Record a custom metric
     */
    public recordMetric(name: string, value: number): void {
        this.metrics.set(name, value);
    }

    /**
     * Get a recorded metric
     */
    public getMetric(name: string): number | undefined {
        return this.metrics.get(name);
    }

    /**
     * Report all metrics to console
     */
    public reportMetrics(): void {
        console.group('📊 Performance Metrics');
        console.log(`FPS: ${this.fps}`);
        console.log(`Memory: ${this.memoryUsage}MB`);

        this.metrics.forEach((value, name) => {
            console.log(`${name}: ${value}`);
        });

        console.groupEnd();
    }

    /**
     * Check if performance is acceptable
     */
    public isHealthy(): boolean {
        return this.fps >= 30 && this.memoryUsage < 150;
    }

    /**
     * Get performance summary
     */
    public getSummary(): { fps: number; memory: number; healthy: boolean } {
        return {
            fps: this.fps,
            memory: this.memoryUsage,
            healthy: this.isHealthy(),
        };
    }

    /**
     * Enable continuous reporting
     */
    public enableReporting(): void {
        this.isEnabled = true;
        console.log('✅ Performance monitoring enabled');
    }

    /**
     * Disable continuous reporting
     */
    public disableReporting(): void {
        this.isEnabled = false;
        console.log('❌ Performance monitoring disabled');
    }
}

/**
 * Logger for debug output with different levels
 */
export class GameLogger {
    private logs: LogEntry[] = [];
    private maxLogs: number = 1000;
    private logLevel: LogLevel = 'info';

    type LogLevel = 'debug' | 'info' | 'warn' | 'error';

    interface LogEntry {
        timestamp: number;
        level: LogLevel;
        message: string;
        data?: any;
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    public debug(message: string, data?: any): void {
        this.log('debug', message, data);
    }

    public info(message: string, data?: any): void {
        this.log('info', message, data);
    }

    public warn(message: string, data?: any): void {
        this.log('warn', message, data);
    }

    public error(message: string, data?: any): void {
        this.log('error', message, data);
    }

    private log(level: LogLevel, message: string, data?: any): void {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            message,
            data,
        };

        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        const emoji = {
            debug: '🔍',
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
        };

        const prefix = `${emoji[level]} [${level.toUpperCase()}]`;
        if (data) {
            console.log(`${prefix} ${message}`, data);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public clearLogs(): void {
        this.logs = [];
    }

    public exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }
}
