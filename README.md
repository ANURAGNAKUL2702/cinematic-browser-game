# Cinematic Browser Game

A scalable, cinematic-quality browser game built with Three.js featuring ultra-realistic visuals, advanced rendering pipeline, and modular architecture.

## Features

- **Neon-Accented Megastructure Scene**: Cyberpunk-inspired floating structures with dynamic lighting
- **Cinematic Camera System**: Smooth camera controls with following, orbiting, and shake effects
- **Advanced Rendering**: Physically correct lighting, shadows, tone mapping, and fog effects
- **Modular Architecture**: Clean, scalable folder structure for easy expansion
- **Player & Enemy AI**: Basic character system with movement and patrol behaviors
- **Real-time Performance**: FPS counter and optimized rendering pipeline

## Project Structure

```
/src
   /core              - Core game engine and utilities
      Renderer.ts     - WebGL renderer setup with cinematic quality settings
      AssetLoader.ts  - Asset loading and procedural texture generation
   /cameras
      CinematicCamera.ts - Camera with smooth interpolation and effects
   /characters
      Player.ts       - Player character with neon accents
      EnemyAI.ts      - Enemy AI with state machine (patrol, chase, attack)
   /scenes
      World.ts        - Main scene with neon megastructures and fog
   /utils
      InputManager.ts - Keyboard and mouse input handling
      TimeManager.ts  - Delta time and FPS calculation
   main.ts            - Game entry point and main loop

/assets              - Game assets (textures, models, etc.)
index.html           - Entry HTML file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The game will open automatically in your browser at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build
```

Production files will be in the `dist/` directory.

## Controls

- **WASD** - Move player
- **Arrow Keys** - Rotate camera (future feature)
- **Space** - Jump (future feature)

## Technical Details

### Rendering Features
- **Shadow Mapping**: PCF soft shadows for realistic lighting
- **Tone Mapping**: ACES Filmic tone mapping for HDR-like visuals
- **Fog System**: Exponential fog for atmospheric depth
- **Neon Effects**: Emissive materials with pulsating lights
- **Physically Correct Lighting**: Realistic light behavior

### Scene Elements
- Central megastructure tower
- Floating platforms with gradient neon accents
- Vertical neon pillars arranged in circular pattern
- Reflective ground with grid overlay
- Dynamic point lights with shadow casting

## Architecture

The game follows a modular architecture:

1. **Core Layer**: Fundamental systems (rendering, asset loading)
2. **Scene Layer**: World building and environment management
3. **Entity Layer**: Characters, NPCs, and interactive objects
4. **Systems Layer**: Input, time, and utility systems
5. **Presentation Layer**: UI and HUD elements

## Future Enhancements

- Advanced player controls and physics
- More enemy types and behaviors
- Particle effects and post-processing
- Sound system integration
- Multiplayer support
- Level loading system
- Weapon and combat systems

## License

MIT