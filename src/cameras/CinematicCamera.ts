import * as THREE from 'three';

/**
 * Cinematic camera with smooth controls and effects
 * Provides camera movements suitable for cinematic gameplay
 */
export class CinematicCamera {
  private camera: THREE.PerspectiveCamera;
  private targetPosition: THREE.Vector3;
  private targetLookAt: THREE.Vector3;
  private smoothFactor: number;

  constructor(fov: number = 75, aspect: number = window.innerWidth / window.innerHeight, near: number = 0.1, far: number = 1000) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.targetPosition = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.smoothFactor = 0.05; // Smooth interpolation factor
    
    this.setupCamera();
  }

  private setupCamera(): void {
    // Set initial position for a cinematic view
    this.camera.position.set(0, 50, 100);
    this.camera.lookAt(0, 0, 0);
    
    // Copy initial position to target
    this.targetPosition.copy(this.camera.position);
    this.targetLookAt.set(0, 0, 0);
  }

  /**
   * Set target position for smooth camera movement
   */
  public setTargetPosition(x: number, y: number, z: number): void {
    this.targetPosition.set(x, y, z);
  }

  /**
   * Set target look-at point
   */
  public setTargetLookAt(x: number, y: number, z: number): void {
    this.targetLookAt.set(x, y, z);
  }

  /**
   * Update camera position with smooth interpolation
   */
  public update(_deltaTime: number = 0.016): void {
    // Smooth interpolation towards target position
    this.camera.position.lerp(this.targetPosition, this.smoothFactor);
    
    // Smooth look-at interpolation
    const currentLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(currentLookAt);
    currentLookAt.add(this.camera.position);
    currentLookAt.lerp(this.targetLookAt, this.smoothFactor);
    
    this.camera.lookAt(currentLookAt);
  }

  /**
   * Set camera smooth factor (0-1, lower = smoother but slower)
   */
  public setSmoothFactor(factor: number): void {
    this.smoothFactor = THREE.MathUtils.clamp(factor, 0, 1);
  }

  /**
   * Perform a cinematic orbit around a point
   */
  public orbitAround(center: THREE.Vector3, radius: number, angle: number, height: number): void {
    const x = center.x + radius * Math.cos(angle);
    const z = center.z + radius * Math.sin(angle);
    const y = center.y + height;
    
    this.setTargetPosition(x, y, z);
    this.setTargetLookAt(center.x, center.y, center.z);
  }

  /**
   * Apply camera shake effect for impact
   */
  public shake(intensity: number = 0.5, duration: number = 0.3): void {
    const originalPosition = this.camera.position.clone();
    const shakeStart = Date.now();
    
    const shakeInterval = setInterval(() => {
      const elapsed = (Date.now() - shakeStart) / 1000;
      
      if (elapsed > duration) {
        clearInterval(shakeInterval);
        this.camera.position.copy(originalPosition);
        return;
      }
      
      const shakeAmount = intensity * (1 - elapsed / duration);
      this.camera.position.x = originalPosition.x + (Math.random() - 0.5) * shakeAmount;
      this.camera.position.y = originalPosition.y + (Math.random() - 0.5) * shakeAmount;
      this.camera.position.z = originalPosition.z + (Math.random() - 0.5) * shakeAmount;
    }, 16);
  }

  /**
   * Get the Three.js camera instance
   */
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  /**
   * Update aspect ratio (call on window resize)
   */
  public updateAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
