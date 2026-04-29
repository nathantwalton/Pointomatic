# Pointomatic - React App

A modern, fully configured React application ready for deployment on Vercel.

## Features

✨ **Built with:**
- React 18
- Vite (fast build tool)
- Hot Module Replacement (HMR)
- Production optimized

🚀 **Ready for:**
- Local development
- Vercel deployment
- GitHub integration

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config
├── .gitignore              # Git ignore rules
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main App component
    ├── App.css             # Component styles
    └── index.css           # Global styles
```

## Deploying to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"Add New Project"**
4. Select your GitHub repository
5. Click **"Import"** - Vercel auto-detects all settings
6. Click **"Deploy"**

Your app will be live and automatically redeployed on every push!

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy your app.

## Customization

Edit `src/App.jsx` to customize your application. The app will automatically hot-reload as you make changes during development.

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_API_URL=https://api.example.com
```

Access in your code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build Scripts

- `npm run dev` - Start development server
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to Vercel using CLI

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript

## License

MIT

## Support

For questions or issues:
- Check [Vite Documentation](https://vitejs.dev)
- Check [React Documentation](https://react.dev)
- Check [Vercel Documentation](https://vercel.com/docs)

---

**Happy coding! 🎉**
