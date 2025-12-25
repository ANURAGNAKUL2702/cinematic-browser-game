import * as THREE from 'three';

/**
 * Asset loader utility for managing game resources
 * Provides centralized loading for textures, models, and other assets
 */
export class AssetLoader {
  private textureLoader: THREE.TextureLoader;
  private loadingManager: THREE.LoadingManager;
  private loadedAssets: Map<string, any>;

  constructor() {
    this.loadedAssets = new Map();
    
    // Create loading manager with callbacks
    this.loadingManager = new THREE.LoadingManager(
      this.onLoadComplete.bind(this),
      this.onProgress.bind(this),
      this.onError.bind(this)
    );
    
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  private onLoadComplete(): void {
    console.log('All assets loaded successfully');
  }

  private onProgress(url: string, loaded: number, total: number): void {
    const progress = (loaded / total) * 100;
    console.log(`Loading: ${progress.toFixed(2)}% - ${url}`);
  }

  private onError(url: string): void {
    console.error(`Error loading asset: ${url}`);
  }

  /**
   * Load a texture from URL
   */
  public async loadTexture(url: string): Promise<THREE.Texture> {
    // Check if already loaded
    if (this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.loadedAssets.set(url, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Create a procedural gradient texture for neon effects
   */
  public createGradientTexture(
    color1: THREE.Color,
    color2: THREE.Color,
    width: number = 256,
    height: number = 256
  ): THREE.DataTexture {
    const size = width * height;
    const data = new Uint8Array(4 * size);

    for (let i = 0; i < height; i++) {
      const t = i / height;
      const r = Math.floor(color1.r * 255 * (1 - t) + color2.r * 255 * t);
      const g = Math.floor(color1.g * 255 * (1 - t) + color2.g * 255 * t);
      const b = Math.floor(color1.b * 255 * (1 - t) + color2.b * 255 * t);

      for (let j = 0; j < width; j++) {
        const stride = (i * width + j) * 4;
        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
        data[stride + 3] = 255;
      }
    }

    const texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Get a loaded asset by URL
   */
  public getAsset(url: string): any {
    return this.loadedAssets.get(url);
  }

  /**
   * Clear all loaded assets
   */
  public clear(): void {
    this.loadedAssets.clear();
  }
}
