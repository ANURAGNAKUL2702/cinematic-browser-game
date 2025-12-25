import * as THREE from 'three';
import { AssetLoader } from '../core/AssetLoader';

/**
 * World scene with neon-accented megastructure and fog effects
 * Creates a cinematic cyberpunk-inspired environment
 */
export class World {
  private scene: THREE.Scene;
  private assetLoader: AssetLoader;
  private megastructures: THREE.Group;
  private neonLights: THREE.Light[];

  constructor() {
    this.scene = new THREE.Scene();
    this.assetLoader = new AssetLoader();
    this.megastructures = new THREE.Group();
    this.neonLights = [];
    
    this.setupScene();
    this.createMegastructures();
    this.createNeonLighting();
    this.createFog();
    this.createGround();
  }

  private setupScene(): void {
    // Set dark background for cyberpunk atmosphere
    this.scene.background = new THREE.Color(0x0a0a1a);
    
    // Add ambient light for base visibility
    const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
    this.scene.add(ambientLight);
  }

  private createMegastructures(): void {
    // Create floating megastructure platforms with neon accents
    const structures = [];
    
    // Main central tower
    const towerGeometry = new THREE.BoxGeometry(20, 100, 20);
    const towerMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x000033,
      emissiveIntensity: 0.2
    });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(0, 50, -50);
    tower.castShadow = true;
    tower.receiveShadow = true;
    structures.push(tower);
    
    // Add neon edge lights to tower
    this.addNeonEdges(tower, 0x00ffff);
    
    // Floating platforms with gradient neon
    const platforms = [
      { pos: new THREE.Vector3(-30, 20, -30), color: 0xff00ff },
      { pos: new THREE.Vector3(30, 25, -40), color: 0x00ffff },
      { pos: new THREE.Vector3(-40, 18, -60), color: 0xff0066 },
      { pos: new THREE.Vector3(40, 22, -70), color: 0x00ff88 }
    ];
    
    platforms.forEach(platform => {
      const platformGeometry = new THREE.CylinderGeometry(8, 10, 3, 6);
      const platformMaterial = new THREE.MeshStandardMaterial({
        color: 0x2e2e3e,
        metalness: 0.7,
        roughness: 0.3,
        emissive: platform.color,
        emissiveIntensity: 0.3
      });
      const platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
      platformMesh.position.copy(platform.pos);
      platformMesh.castShadow = true;
      platformMesh.receiveShadow = true;
      structures.push(platformMesh);
      
      // Add neon ring around platform
      this.addNeonRing(platformMesh, platform.color);
    });
    
    // Vertical neon pillars
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 60;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const pillarGeometry = new THREE.CylinderGeometry(1, 1, 80, 8);
      const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        metalness: 0.8,
        roughness: 0.2,
        emissive: i % 2 === 0 ? 0xff00ff : 0x00ffff,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(x, 40, z);
      structures.push(pillar);
    }
    
    structures.forEach(structure => this.megastructures.add(structure));
    this.scene.add(this.megastructures);
  }

  private addNeonEdges(mesh: THREE.Mesh, color: number): void {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2
    });
    const edgeLines = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(edgeLines);
  }

  private addNeonRing(mesh: THREE.Mesh, color: number): void {
    const ringGeometry = new THREE.TorusGeometry(12, 0.3, 8, 32);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 3.0,
      transparent: true,
      opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.5;
    mesh.add(ring);
  }

  private createNeonLighting(): void {
    // Create pulsating neon point lights
    const neonColors = [
      { color: 0xff00ff, pos: new THREE.Vector3(-30, 25, -30) },
      { color: 0x00ffff, pos: new THREE.Vector3(30, 30, -40) },
      { color: 0xff0066, pos: new THREE.Vector3(-40, 23, -60) },
      { color: 0x00ff88, pos: new THREE.Vector3(40, 27, -70) }
    ];
    
    neonColors.forEach(neon => {
      const light = new THREE.PointLight(neon.color, 2, 50);
      light.position.copy(neon.pos);
      light.castShadow = true;
      light.shadow.mapSize.width = 512;
      light.shadow.mapSize.height = 512;
      this.scene.add(light);
      this.neonLights.push(light);
      
      // Add visible light sphere
      const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: neon.color
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(neon.pos);
      this.scene.add(sphere);
    });
    
    // Add directional light for overall scene lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);
  }

  private createFog(): void {
    // Add exponential fog for depth and atmosphere
    this.scene.fog = new THREE.FogExp2(0x0a0a1a, 0.01);
  }

  private createGround(): void {
    // Create reflective ground plane with grid
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
    
    // Create custom shader material for neon grid effect
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a1a,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x00ffff,
      emissiveIntensity: 0.1
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // Add neon grid lines
    const gridHelper = new THREE.GridHelper(200, 40, 0xff00ff, 0x00ffff);
    gridHelper.position.y = 0.1;
    const gridMaterial = gridHelper.material as THREE.Material;
    if (gridMaterial instanceof THREE.LineBasicMaterial) {
      gridMaterial.opacity = 0.5;
      gridMaterial.transparent = true;
    }
    this.scene.add(gridHelper);
  }

  /**
   * Update world animation
   */
  public update(deltaTime: number): void {
    const time = Date.now() * 0.001;
    
    // Animate megastructure - slow floating motion
    this.megastructures.position.y = Math.sin(time * 0.3) * 2;
    this.megastructures.rotation.y += deltaTime * 0.05;
    
    // Pulsate neon lights
    this.neonLights.forEach((light, index) => {
      const pulseSpeed = 1 + index * 0.3;
      light.intensity = 2 + Math.sin(time * pulseSpeed) * 0.5;
    });
  }

  /**
   * Get the Three.js scene
   */
  public getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get asset loader instance
   */
  public getAssetLoader(): AssetLoader {
    return this.assetLoader;
  }
}
