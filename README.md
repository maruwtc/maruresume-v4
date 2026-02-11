# ChrisOS Portfolio

A web-based portfolio that behaves like a lightweight operating system.

The app supports desktop, tablet, and phone interaction models, includes a terminal with a safe CTF simulation, and embeds a live GitHub-powered projects explorer.

## Features
- Desktop OS shell
  - Windowed apps
  - Drag to move
  - Drag to resize
  - Icon selection and double-click open
  - Desktop drag-box multi-select
- Tablet OS shell (iPad-style)
  - Home launcher
  - App stage view
  - Dock-based switching
- Phone OS shell (iOS-style)
  - Home launcher
  - Full app view
  - Home/back controls
  - Bottom dock
- Built-in apps
  - `About.me`
  - `Experience.log`
  - `Skills.matrix`
  - `Contact.link`
  - `Projects.dir` (embedded `/projects` app)
  - `Attack-Handbook`
  - `Security-Terminal`
- Terminal CTF simulation
  - Challenge lifecycle: `ctf list`, `ctf start`, `ctf hint`, `ctf status`, `ctf exit`, `ctf reset`
  - Simulated shell commands: `ls`, `cd`, `cat`, `grep`, `strings`, `submit`
- Projects page
  - Fetches repos from GitHub API
  - README previews
  - Optional Microlink screenshots

## Stack
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger (projects page animations)
- Lucide icons
- Vercel Analytics

## Project Structure
- `src/app/page.tsx`: top-level OS state/orchestration
- `src/components/os/types.ts`: shared OS types
- `src/components/os/data.ts`: app registry + shared data/constants
- `src/components/os/DesktopWindow.tsx`: desktop window UI
- `src/components/os/PhoneShell.tsx`: phone shell
- `src/components/os/TabletShell.tsx`: tablet shell
- `src/components/os/AppBody.tsx`: app content renderer
- `src/components/os/TerminalApp.tsx`: terminal + CTF engine
- `src/app/projects/page.tsx`: projects app page

## Getting Started
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables
Create `.env` (or `.env.local`) with:

```bash
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
NEXT_PUBLIC_GITHUB_URL=https://github.com/your_username
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your_profile
NEXT_PUBLIC_RESUME_URL=https://your-resume-url
```

Optional:

```bash
NEXT_PUBLIC_MICROLINK_API_KEY=your_microlink_api_key
```

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint

## Notes
- `Projects` currently has lint warnings for raw `<img>` usage in `src/app/projects/page.tsx`.
- Terminal CTF is intentionally simulated and safe for practice UX.

## License
MIT
