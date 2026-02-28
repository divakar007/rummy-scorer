# Rummy Scorer App

Cross-platform Rummy Scorer built with Expo + React Native + TypeScript + NativeWind.

## Tech Stack
- React Native (Expo)
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- Context API for global state
- AsyncStorage for local persistence

## Features
- Game setup with dynamic players.
- Configurable total score, drop score, middle drop score
- Round entry with Drop and Middle Drop shortcuts
- Running totals with knockout logic
- Knocked-out players locked from future round entries
- Edit and delete previous rounds with automatic recalculation
- Round history table
- Highest score highlight in red
- Reset Game and New Game actions
- Responsive card-based UI for mobile and web

## Project Structure
```text
src/
  components/
    PlayerCard.tsx
    RoundEntry.tsx
  context/
    GameContext.tsx
  screens/
    GameSetupScreen.tsx
    GameScreen.tsx
  types/
    game.ts
  utils/
    gameLogic.ts
```

## Prerequisites
- Node.js 18+ (recommended: Node.js 20)
- npm
- Expo CLI via `npx`

## Install
```bash
npm install
```

## Run Locally
```bash
npm run start
```

### Platform Commands
```bash
npm run web
npm run android
npm run ios
```

## Build Checks
```bash
npm run typecheck
npm run build:web
```

## NativeWind Setup (already configured)
- `tailwind.config.js` with `nativewind/preset`
- `babel.config.js` with `nativewind/babel`
- `metro.config.js` with `withNativeWind(...)`
- `global.css` with Tailwind directives
- `nativewind-env.d.ts` type reference

## Deployment: GitHub CI -> Azure Static Web Apps

This repo includes:
- GitHub Actions workflow: `.github/workflows/azure-static-web-apps.yml`
- Azure SPA routing config: `public/staticwebapp.config.json`

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial app + Azure Static Web Apps CI"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Create Azure Static Web App
1. In Azure Portal, create **Static Web App**.
2. Connect your GitHub repository and `main` branch.

### 3. Add GitHub Secret
In your GitHub repo settings, add:
- `AZURE_STATIC_WEB_APPS_API_TOKEN` = deployment token from Azure Static Web App.

### 4. CI/CD Build Details
The workflow performs:
1. `npm ci`
2. `npx expo export --platform web`
3. Deploys `dist/` to Azure Static Web Apps

### 5. Verify Deployment
After workflow success, open your `*.azurestaticapps.net` URL.

## Notes
- Local game state is stored in AsyncStorage and persists between app restarts.
- This is a frontend-only deployment (no backend API configured).
