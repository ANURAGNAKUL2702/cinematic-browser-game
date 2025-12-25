import * as THREE from 'three';

/**
 * Core renderer class for the cinematic game engine
 * Handles WebGL rendering setup and configuration
 */
export class Renderer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    
    // Initialize WebGL renderer with enhanced settings for cinematic quality
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    
    this.setupRenderer();
  }

  private setupRenderer(): void {
    // Enable shadows for cinematic lighting
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set output encoding for better color representation
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Enable tone mapping for HDR-like effects
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    // Set pixel ratio for crisp rendering
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Set initial size
    this.resize();
    
    // Append to DOM
    document.body.appendChild(this.renderer.domElement);
  }

  /**
   * Resize the renderer to match window dimensions
   */
  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.renderer.setSize(width, height);
    
    // Update camera aspect if it's a perspective camera
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * Render the scene
   */
  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Get the WebGL renderer instance
   */
  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
