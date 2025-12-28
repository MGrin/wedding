# ⚡️ Cyberpunk Wedding Invitation 2025

A high-immersion, interactive wedding invitation built with a futuristic cyberpunk aesthetic. This project features advanced visual effects, 3D backgrounds, and a custom audio system to create a unique "digital dossier" experience for guests.

## 🚀 Tech Stack

- **Runtime & Bundler:** [Bun](https://bun.sh)
- **Frontend:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics:** [Three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio:** [use-sound](https://github.com/joshwcomeau/use-sound) (Howler.js)
- **Routing:** [React Router 7](https://reactrouter.com/)

## ✨ Key Features

### 🎨 Visual Immersion

- **Dynamic Background:** A 3D grid-based cyberpunk environment that reacts to scroll progress.
- **Glitch Mode:** A global state that triggers intense visual deformations, chromatic aberration, and UI "instability".
- **Cyber-UI Components:** Custom-built `NeonButton`, `GlitchText`, and `StickyMenu` with CRT scanline overlays.
- **Responsive Design:** Fully optimized for mobile "cyber-decks" and desktop terminals.

### 📂 Guest Dossier System

- **Interactive Guest List:** Browse the guest list with a high-tech "intel" interface.
- **AI Portraits:** Each guest features a unique, AI-generated cyberpunk portrait.
- **Detailed Intel:** View guest roles, descriptions, and relationships in a stylized modal.

### 🔊 Audio Experience

- **Atmospheric Soundtrack:** Calm 80s-style synthwave background music.
- **Mechanical UI Sounds:** Tactile audio feedback for clicks, page transitions, and section scrolling.
- **Audio Control:** Global mute/unmute toggle integrated into the main menu.

### 🌍 Localization

- **Dual Language Support:** Full translations for **English** and **Russian**.
- **Persistent Settings:** Language and audio preferences are saved to local storage.

## 🛠 Project Structure

```text
src/
├── components/
│   ├── cyberpunk/      # Specialized Cyberpunk UI components
│   │   ├── SoundContext.tsx  # Audio management system
│   │   ├── GlitchContext.tsx # Global glitch state
│   │   └── ...               # NeonButton, GlitchText, etc.
│   └── ui/             # Base UI components (Radix/Shadcn)
├── data/
│   └── guests.ts       # Guest list and dossier data
├── i18n.ts             # Translation strings (EN/RU)
├── App.tsx             # Main application logic & routing
└── index.ts            # Entry point
```

## 🚦 Getting Started

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

### Production Build

```bash
bun run build
```

### Preview Build Locally

```bash
bun run preview
```

## 🌐 Deployment (Render.com)

This project is optimized for deployment as a **Static Site** on Render.

1. **Connect your GitHub repository** to Render.com.
2. **Select "Static Site"** as the service type.
3. **Configure the following settings:**
   - **Build Command:** `bun install && bun run build`
   - **Publish Directory:** `dist`
4. **Environment Variables:**
   - Render automatically detects Bun if you use the `render.yaml` blueprint provided in the repository.

Alternatively, you can use the **Render Blueprint** by simply clicking "New +" -> "Blueprint" and selecting this repository.

## 📝 Customization

- **Guest Data:** Edit `src/data/guests.ts` to update the guest list, roles, and portrait URLs.
- **Translations:** Modify `src/i18n.ts` to change any text across the site.
- **Visuals:** Adjust glitch probabilities and animation speeds in `src/components/cyberpunk/GlitchContext.tsx`.

---

_Built for the future. See you at the terminal._ 🦾
