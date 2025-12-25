import * as THREE from 'three';

/**
 * Player character class
 * Manages player entity, movement, and interactions
 */
export class Player {
  private mesh: THREE.Mesh;
  private velocity: THREE.Vector3;
  private speed: number;
  private health: number;

  constructor(scene: THREE.Scene, position: THREE.Vector3 = new THREE.Vector3(0, 5, 0)) {
    this.velocity = new THREE.Vector3();
    this.speed = 10;
    this.health = 100;
    
    this.mesh = this.createPlayerMesh();
    this.mesh.position.copy(position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    scene.add(this.mesh);
  }

  private createPlayerMesh(): THREE.Mesh {
    // Create a futuristic player mesh with neon accents
    const geometry = new THREE.CapsuleGeometry(1, 2, 8, 16);
    
    // Metallic material with emissive neon effect
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add a neon ring accent
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.1, 8, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1;
    mesh.add(ring);
    
    return mesh;
  }

  /**
   * Update player state
   */
  public update(deltaTime: number): void {
    // Apply velocity
    this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    
    // Apply damping to velocity
    this.velocity.multiplyScalar(0.9);
    
    // Prevent falling through ground
    if (this.mesh.position.y < 1) {
      this.mesh.position.y = 1;
      this.velocity.y = 0;
    }
  }

  /**
   * Move player in a direction
   */
  public move(direction: THREE.Vector3): void {
    this.velocity.add(direction.multiplyScalar(this.speed));
  }

  /**
   * Get player position
   */
  public getPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  /**
   * Set player position
   */
  public setPosition(position: THREE.Vector3): void {
    this.mesh.position.copy(position);
  }

  /**
   * Take damage
   */
  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    
    // Visual feedback - flash red
    const material = this.mesh.material as THREE.MeshStandardMaterial;
    const originalEmissive = material.emissive.clone();
    material.emissive.set(0xff0000);
    
    setTimeout(() => {
      material.emissive.copy(originalEmissive);
    }, 200);
  }

  /**
   * Get player health
   */
  public getHealth(): number {
    return this.health;
  }

  /**
   * Check if player is alive
   */
  public isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Get player mesh for collision detection
   */
  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
}
