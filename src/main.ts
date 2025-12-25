import * as THREE from 'three';
import { Renderer } from './core/Renderer';
import { World } from './scenes/World';
import { CinematicCamera } from './cameras/CinematicCamera';
import { Player } from './characters/Player';
import { EnemyAI } from './characters/EnemyAI';
import { InputManager } from './utils/InputManager';
import { TimeManager } from './utils/TimeManager';

/**
 * Main game class - Entry point for the cinematic browser game
 */
class Game {
  private renderer!: Renderer;
  private world!: World;
  private camera!: CinematicCamera;
  private player!: Player;
  private enemies: EnemyAI[];
  private inputManager: InputManager;
  private timeManager: TimeManager;
  private isRunning: boolean;

  constructor() {
    this.enemies = [];
    this.inputManager = new InputManager();
    this.timeManager = new TimeManager();
    this.isRunning = false;
    
    this.init();
  }

  private async init(): Promise<void> {
    console.log('Initializing Cinematic Browser Game...');
    
    // Create world scene
    this.world = new World();
    
    // Create cinematic camera
    this.camera = new CinematicCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create renderer
    this.renderer = new Renderer(this.world.getScene(), this.camera.getCamera());
    
    // Create player
    this.player = new Player(this.world.getScene(), new THREE.Vector3(0, 5, 50));
    
    // Create enemies
    this.createEnemies();
    
    // Setup camera to follow player
    this.setupCamera();
    
    // Add resize handler
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Add FPS counter to UI
    this.createUI();
    
    // Start game loop
    this.isRunning = true;
    this.animate();
    
    console.log('Game initialized successfully!');
  }

  private createEnemies(): void {
    // Spawn multiple enemies around the scene
    const enemyPositions = [
      new THREE.Vector3(20, 5, 0),
      new THREE.Vector3(-20, 5, -20),
      new THREE.Vector3(0, 5, -40)
    ];
    
    enemyPositions.forEach(pos => {
      const enemy = new EnemyAI(this.world.getScene(), pos);
      this.enemies.push(enemy);
    });
  }

  private setupCamera(): void {
    // Position camera behind and above player for cinematic view
    const playerPos = this.player.getPosition();
    this.camera.setTargetPosition(
      playerPos.x,
      playerPos.y + 15,
      playerPos.z + 30
    );
    this.camera.setTargetLookAt(playerPos.x, playerPos.y, playerPos.z);
  }

  private createUI(): void {
    // Create FPS counter
    const fpsCounter = document.createElement('div');
    fpsCounter.id = 'fps-counter';
    fpsCounter.style.position = 'fixed';
    fpsCounter.style.top = '10px';
    fpsCounter.style.right = '10px';
    fpsCounter.style.color = '#00ffff';
    fpsCounter.style.fontFamily = 'monospace';
    fpsCounter.style.fontSize = '16px';
    fpsCounter.style.textShadow = '0 0 10px #00ffff';
    fpsCounter.style.zIndex = '1000';
    document.body.appendChild(fpsCounter);
    
    // Create controls info
    const controls = document.createElement('div');
    controls.id = 'controls';
    controls.style.position = 'fixed';
    controls.style.bottom = '10px';
    controls.style.left = '10px';
    controls.style.color = '#ff00ff';
    controls.style.fontFamily = 'monospace';
    controls.style.fontSize = '14px';
    controls.style.textShadow = '0 0 10px #ff00ff';
    controls.style.zIndex = '1000';
    controls.innerHTML = `
      <strong>CONTROLS:</strong><br>
      WASD - Move Player<br>
      Arrow Keys - Rotate Camera<br>
      Space - Jump (future feature)
    `;
    document.body.appendChild(controls);
  }

  private handleInput(deltaTime: number): void {
    const moveSpeed = 10;
    const movement = new THREE.Vector3();
    
    // Player movement
    if (this.inputManager.isKeyPressed('KeyW')) {
      movement.z -= moveSpeed * deltaTime;
    }
    if (this.inputManager.isKeyPressed('KeyS')) {
      movement.z += moveSpeed * deltaTime;
    }
    if (this.inputManager.isKeyPressed('KeyA')) {
      movement.x -= moveSpeed * deltaTime;
    }
    if (this.inputManager.isKeyPressed('KeyD')) {
      movement.x += moveSpeed * deltaTime;
    }
    
    if (movement.length() > 0) {
      this.player.move(movement);
    }
  }

  private updateCamera(): void {
    // Smooth camera follow
    const playerPos = this.player.getPosition();
    this.camera.setTargetPosition(
      playerPos.x,
      playerPos.y + 15,
      playerPos.z + 30
    );
    this.camera.setTargetLookAt(playerPos.x, playerPos.y, playerPos.z);
  }

  private animate(): void {
    if (!this.isRunning) return;
    
    requestAnimationFrame(() => this.animate());
    
    // Update time
    this.timeManager.update();
    const deltaTime = this.timeManager.getDeltaTime();
    
    // Handle input
    this.handleInput(deltaTime);
    
    // Update game objects
    this.world.update(deltaTime);
    this.player.update(deltaTime);
    this.camera.update(deltaTime);
    
    // Update enemies
    const playerPos = this.player.getPosition();
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime, playerPos);
    });
    
    // Update camera to follow player
    this.updateCamera();
    
    // Render scene
    this.renderer.render();
    
    // Update FPS counter
    const fpsCounter = document.getElementById('fps-counter');
    if (fpsCounter) {
      fpsCounter.textContent = `FPS: ${this.timeManager.getFPS()}`;
    }
  }

  private onWindowResize(): void {
    this.camera.updateAspect(window.innerWidth / window.innerHeight);
    this.renderer.resize();
  }

  public stop(): void {
    this.isRunning = false;
  }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Game();
  });
} else {
  new Game();
}

export { Game };
