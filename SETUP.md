# Installation & Setup Guide

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Gabriruss1/FantasyBattleArena.git
cd FantasyBattleArena

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:3000
```

## Development Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Gameplay Controls

### Mouse/Touch
- **Move Mouse** - Ruota la camera attorno al campo di battaglia
- **Scroll** - Zoom in/out della camera

### Keyboard
- **1** - Attacco
- **2** - Magia
- **3** - Difesa
- **4** - Oggetti
- **M** - Mute audio
- **ESC** - Pausa (futuro)

### UI Buttons
- **⚔️ Attacco** - Colpisci il nemico selezionato
- **✨ Magia** - Lancia incantesimi (consuma MP)
- **🛡️ Difesa** - Aumenta armatura
- **💊 Oggetti** - Usa pozioni

## Game Systems

### Battle System
- Turn-based combat
- Player vs Multiple Enemies
- AI enemy AI reactions
- Status effects (future)

### Character Stats
```
- HP: Punti salute
- MP: Punti magia
- Attack: Danno fisico
- Defense: Riduzione danno
- Speed: Ordine turni
- Level: Esperienza
```

### Visual Effects
- Particle explosions
- Lightning strikes
- Healing auras
- Damage indicators
- Character animations

### Audio
- Battle theme loop
- Attack sound effects
- Magic spell sounds
- Victory fanfare
- Toggle mute (M key)

## Project Structure

```
FantasyBattleArena/
├── index.html                    # Main HTML
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts               # Vite config
├── postcss.config.js            # PostCSS config
├── tailwind.config.js           # Tailwind config
│
├── src/
│   ├── main.ts                  # Entry point
│   ├── index.html               # Game canvas
│   │
│   ├── engine/
│   │   └── GameEngine.ts        # Core game loop
│   │
│   ├── systems/
│   │   ├── Character.ts         # Character base class
│   │   ├── CharacterManager.ts  # Manage all characters
│   │   ├── BattleSystem.ts      # Turn-based combat
│   │   ├── UIManager.ts         # HUD and UI
│   │   ├── CameraController.ts  # Camera control
│   │   ├── Inventory.ts         # Item system
│   │   └── Boss.ts              # Boss class
│   │
│   ├── scenes/
│   │   └── SceneBuilder.ts      # Scene creation
│   │
│   ├── effects/
│   │   └── EffectSystem.ts      # Visual effects
│   │
│   ├── audio/
│   │   └── AudioManager.ts      # Sound management
│   │
│   └── styles/
│       └── global.css           # Global styles
│
└── README.md                    # Documentation
```

## Technologies Used

| Technology | Version | Purpose |
|-----------|---------|---------|
| Three.js | r128 | 3D Graphics |
| GSAP | 3.12.2 | Animations |
| Howler.js | 2.2.4 | Audio |
| TypeScript | 5.3.3 | Type Safety |
| Vite | 5.0.0 | Build System |
| Tailwind CSS | 3.4.1 | Styling |

## Performance Tips

- WebGL hardware acceleration enabled
- Shadow map caching
- Particle pooling
- LOD camera management
- Optimized material shaders

## Browser Support

- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Edge: Full support
- Mobile browsers: Full support

## Troubleshooting

### Game won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Poor performance
- Reduce particle count in EffectSystem.ts
- Disable shadows: renderer.shadowMap.enabled = false
- Lower resolution: renderer.setPixelRatio(0.5)

### No audio
- Check browser audio permissions
- Press M to toggle mute
- Check Howler.js initialization

### Camera issues
- Move mouse to center canvas
- Check touch device support
- Verify camera bounds in CameraController.ts

## Next Steps

1. Add more enemy types
2. Implement boss battles
3. Create level progression
4. Add particle effects variety
5. Implement UI menus
6. Add sound effects library
7. Create boss special effects

## Contributing

Pull requests welcome! Please follow:
- TypeScript strict mode
- GSAP for animations
- Three.js best practices
- Mobile-first design

## License

MIT License - Free for commercial and personal use
