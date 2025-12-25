/**
 * Time manager for handling delta time and frame rate
 */
export class TimeManager {
  private lastTime: number;
  private deltaTime: number;
  private fps: number;
  private frameCount: number;
  private fpsUpdateTime: number;

  constructor() {
    this.lastTime = performance.now();
    this.deltaTime = 0;
    this.fps = 60;
    this.frameCount = 0;
    this.fpsUpdateTime = 0;
  }

  /**
   * Update time calculations - call once per frame
   */
  public update(): void {
    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Calculate FPS
    this.frameCount++;
    this.fpsUpdateTime += this.deltaTime;

    if (this.fpsUpdateTime >= 1.0) {
      this.fps = this.frameCount / this.fpsUpdateTime;
      this.frameCount = 0;
      this.fpsUpdateTime = 0;
    }
  }

  /**
   * Get delta time in seconds
   */
  public getDeltaTime(): number {
    return this.deltaTime;
  }

  /**
   * Get current FPS
   */
  public getFPS(): number {
    return Math.round(this.fps);
  }

  /**
   * Get elapsed time since start
   */
  public getElapsedTime(): number {
    return this.lastTime / 1000;
  }
}
