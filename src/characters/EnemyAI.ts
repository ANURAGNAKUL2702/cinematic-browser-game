import * as THREE from 'three';

/**
 * Enemy AI class
 * Manages enemy behavior, pathfinding, and combat
 */
export class EnemyAI {
  private mesh: THREE.Mesh;
  private target: THREE.Vector3;
  private speed: number;
  private health: number;
  private attackRange: number;
  private detectionRange: number;
  private state: 'idle' | 'patrol' | 'chase' | 'attack';
  private patrolPoints: THREE.Vector3[];
  private currentPatrolIndex: number;

  constructor(scene: THREE.Scene, position: THREE.Vector3 = new THREE.Vector3(0, 5, 20)) {
    this.target = new THREE.Vector3();
    this.speed = 5;
    this.health = 50;
    this.attackRange = 3;
    this.detectionRange = 30;
    this.state = 'patrol';
    this.currentPatrolIndex = 0;
    
    // Define patrol points
    this.patrolPoints = [
      new THREE.Vector3(10, 5, 10),
      new THREE.Vector3(-10, 5, 10),
      new THREE.Vector3(-10, 5, -10),
      new THREE.Vector3(10, 5, -10)
    ];
    
    this.mesh = this.createEnemyMesh();
    this.mesh.position.copy(position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    scene.add(this.mesh);
  }

  private createEnemyMesh(): THREE.Mesh {
    // Create a hostile-looking enemy with red neon accents
    const geometry = new THREE.OctahedronGeometry(1.5, 0);
    
    const material = new THREE.MeshStandardMaterial({
      color: 0x2e1a1a,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0xff0000,
      emissiveIntensity: 0.7
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add pulsating core
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 3.0,
      transparent: true,
      opacity: 0.9
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    mesh.add(core);
    
    return mesh;
  }

  /**
   * Update enemy AI logic
   */
  public update(deltaTime: number, playerPosition?: THREE.Vector3): void {
    // Rotate enemy for visual effect
    this.mesh.rotation.y += deltaTime * 0.5;
    this.mesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
    
    if (playerPosition) {
      const distanceToPlayer = this.mesh.position.distanceTo(playerPosition);
      
      // State machine
      if (distanceToPlayer < this.attackRange) {
        this.state = 'attack';
      } else if (distanceToPlayer < this.detectionRange) {
        this.state = 'chase';
        this.target.copy(playerPosition);
      } else {
        this.state = 'patrol';
      }
      
      // Execute behavior based on state
      switch (this.state) {
        case 'patrol':
          this.patrol(deltaTime);
          break;
        case 'chase':
          this.chase(deltaTime);
          break;
        case 'attack':
          this.attack(deltaTime);
          break;
      }
    }
    
    // Pulsate core for visual effect
    const core = this.mesh.children[0];
    if (core) {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      core.scale.set(scale, scale, scale);
    }
  }

  private patrol(deltaTime: number): void {
    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    const direction = targetPoint.clone().sub(this.mesh.position);
    
    if (direction.length() < 2) {
      // Reached patrol point, move to next
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    } else {
      // Move towards patrol point
      direction.normalize();
      this.mesh.position.add(direction.multiplyScalar(this.speed * deltaTime));
    }
  }

  private chase(deltaTime: number): void {
    const direction = this.target.clone().sub(this.mesh.position);
    direction.normalize();
    this.mesh.position.add(direction.multiplyScalar(this.speed * deltaTime * 1.5));
  }

  private attack(_deltaTime: number): void {
    // Attack animation - bob up and down aggressively
    const material = this.mesh.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.01) * 0.5;
  }

  /**
   * Take damage
   */
  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    
    if (this.health <= 0) {
      this.destroy();
    }
  }

  /**
   * Get enemy position
   */
  public getPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  /**
   * Check if enemy is alive
   */
  public isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Get enemy state
   */
  public getState(): string {
    return this.state;
  }

  /**
   * Destroy enemy
   */
  private destroy(): void {
    // Remove from scene
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
  }

  /**
   * Get mesh for collision detection
   */
  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
}
