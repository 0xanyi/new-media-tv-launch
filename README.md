# New Media TV Launch Event Website

A stunning, modern one-page website for the New Media TV studio launch event.

## 🚀 Launch Details
- **Date**: Saturday, October 18th
- **Time**: 11:00 AM GMT+1
- **Event**: New Media TV Studio Launch

## 🎯 Features

### ✅ Implemented
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **16:9 Video Player**: HLS.js integration with fallbacks
- **Countdown Timer**: Real-time countdown to launch event
- **Modern UI**: Gradient effects, animations, micro-interactions
- **Accessibility**: Semantic HTML, keyboard navigation
- **Performance**: Optimized loading, smooth animations

### 🎨 Design Elements
- Dark theme with purple/blue gradients
- Particle effects and animations
- Glass morphism effects
- Smooth transitions and hover states
- Mobile-optimized touch controls

## 🚀 Deployment

### Vercel (Recommended)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from project directory
vercel

# 4. Deploy to production
vercel --prod
```

### Alternative Deployment Methods
```bash
# Netlify
# Drag & drop the folder to netlify.app

# GitHub Pages
# Push to GitHub and enable Pages

# Any static hosting
# Upload all files to your web server
```

## 🔧 Setup Instructions

### 1. Update HLS Stream URL
Edit `script.js` and replace the URL on line 31:
```javascript
const hlsStreamUrl = 'https://stream-hls.castr.net/669859478d4515508937865a/live_98c5c5e06bb711efa7fb7fc6a849f4ff/index.m3u8';
```

### 2. Test Locally
```bash
# Start local development server
python3 -m http.server 8000
npm run dev

# Then visit: http://localhost:8000
```

## 📁 File Structure
```
├── index.html          # Main page
├── styles.css          # Modern styling with animations
├── script.js           # Video player & countdown logic
├── package.json        # Project configuration
├── vercel.json         # Vercel deployment config
├── .gitignore          # Git ignore file
├── assets/
│   ├── logo.png        # New Media TV logo ✅
│   ├── poster.PNG      # Video poster image ✅
│   └── fallback-poster.jpg
└── README.md           # This file
```

## ⌨️ Keyboard Shortcuts
- **Space**: Play/Pause video
- **F**: Toggle fullscreen
- **M**: Mute/Unmute

## 📱 Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers with HLS support

## 🎬 HLS Stream Setup
For the video player to work, you'll need:
1. An HLS compatible streaming server
2. A `.m3u8` playlist file
3. Video segments (`.ts` files)

Popular streaming providers:
- AWS MediaLive
- Cloudflare Stream
- Mux
- Wowza
- Dacast

## 🚀 Performance Features
- Lazy loading
- GPU-accelerated animations
- Optimized font loading
- Adaptive bitrate streaming
- Bandwidth-aware buffering

## 🎯 Vercel Deployment Checklist
1. [ ] Install Vercel CLI: `npm i -g vercel`
2. [ ] Login to Vercel: `vercel login`
3. [ ] Verify HLS stream URL in `script.js` line 31
4. [ ] Test locally: `npm run dev`
5. [ ] Deploy to preview: `vercel`
6. [ ] Test preview URL
7. [ ] Deploy to production: `vercel --prod`
8. [ ] Update your domain DNS (if using custom domain)

## 🚀 Quick Deploy Commands
```bash
# One-line deployment (after Vercel CLI setup)
npm i -g vercel && vercel login && vercel --prod
```

## 📱 Mobile Testing
- Test on iPhone/Safari (HLS native support)
- Test on Android/Chrome (HLS.js support)
- Test video autoplay behavior
- Test responsive design

## 🔧 Troubleshooting
- **Autoplay blocked**: Video will show play button
- **Stream not loading**: Check HLS URL format
- **CORS issues**: Verify streaming server allows cross-origin
- **Mobile issues**: Ensure HLS stream is mobile-compatible

## ⚡ Performance Tips
- Your HLS stream should have multiple bitrates
- Use CDN for your assets (logo, poster)
- Enable gzip compression on Vercel (automatic)
- Monitor stream health during launch

---
**🎉 Your New Media TV launch event website is ready for deployment!**
