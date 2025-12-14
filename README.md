# Library of Celsus - 110 AD

Photorealistic web-based time-travel experience of the Library of Celsus in Ephesus.

## Features

- **Exterior Scene**: Photogrammetry model of the Library of Celsus exterior
- **First-Person Navigation**: WASD movement + mouse look controls
- **Door Interaction**: Walk to door and press F to enter interior
- **Interactive Books**: 5 books with full metadata, language selection, download, and in-app reader
- **Realistic Rendering**: ACES tone mapping, shadows, proper lighting

## Tech Stack

- **Next.js 14** (App Router)
- **React Three Fiber** (R3F)
- **Three.js**
- **@react-three/drei** (helpers)
- **TypeScript**
- **Tailwind CSS**

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Controls

- **WASD**: Move (walk)
- **Mouse**: Click and drag to look around
- **F**: Interact with door/books
- **ESC**: Close popups/readers
- **Ctrl+P**: Toggle performance monitor

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Next.js
4. Deploy!

The project is optimized for Vercel deployment.

## Project Structure

```
app/
  ├── page.tsx              # Exterior scene
  ├── interior/
  │   └── page.tsx          # Interior scene
  └── error.tsx             # Error boundary

components/
  ├── scenes/               # Scene components
  ├── three/                # 3D components
  ├── controls/             # Navigation controls
  └── ui/                   # UI components

lib/
  ├── data/                 # Book data
  └── utils/                # Utilities

public/
  ├── models/               # GLB models
  └── books/                # Book files
```

## Next Steps (Future Enhancements)

1. **GLB Optimization**: Run through gltf-transform for mesh/texture optimization
2. **Mobile Controls**: Add virtual joystick for mobile devices
3. **PDF/EPUB Reader**: Integrate pdf.js and epub.js for full reader support
4. **More Books**: Expand from 5 to 10+ books
5. **Interior Geometry**: Replace placeholder with actual interior model
6. **Audio**: Add ambient sounds and footsteps
7. **Animations**: Smooth transitions between scenes

## Known Limitations

- GLB model is unoptimized (21MB) - needs compression
- PDF/EPUB reader shows placeholder (needs pdf.js/epub.js integration)
- Interior is placeholder geometry (needs actual model)
- Mobile controls not yet implemented
- No audio/ambient sounds

## Performance

- Press **Ctrl+P** to toggle performance monitor
- Target: 30+ FPS on desktop, 20+ FPS on mobile
- Current: Monitor with performance tool

