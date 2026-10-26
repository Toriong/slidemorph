# 📸 SlideMorph

Insert HEIC, PDF pages, SVG, WebP and AVIF images into Google Slides

## Overview

SlideMorph is a free Google Workspace Editor add-on for Google Slides that enables users to insert image formats not natively supported by Google Slides. All image conversion happens client-side in the browser—no files are uploaded to any server.

### Supported Formats

- **HEIC/HEIF** - iPhone and modern camera photos
- **PDF** - Select and insert individual pages (with thumbnail picker)
- **SVG** - Scalable vector graphics
- **WebP** - Modern web image format
- **AVIF** - Next-generation image compression

### Key Features

- 🔒 **100% Client-Side Processing** - No server uploads
- 📄 **PDF Page Picker** - Thumbnail preview of all pages
- ⚡ **Automatic Optimization** - Downscales to meet 25 MP / 50 MB limits
- 🎯 **Two Modes** - Insert new or replace selected image
- 🎨 **Clean UI** - Modern sidebar with drag-and-drop

## Technical Stack

- **Runtime**: Google Apps Script (V8)
- **Language**: TypeScript
- **Build**: Webpack + gas-webpack-plugin
- **Deploy**: clasp (Command Line Apps Script Projects)
- **UI**: HtmlService sidebar
- **Client Libraries**:
  - libheif-js (HEIC/HEIF conversion)
  - PDF.js (PDF rendering)
  - Canvas API (SVG/WebP/AVIF conversion)

## Project Structure

```
slidemorph/
├── src/
│   ├── Code.ts                 # Main Apps Script code (server-side)
│   └── Sidebar.html            # Sidebar UI with conversion logic
├── dist/                       # Built output (created by webpack)
├── assets/                     # Marketplace assets
│   ├── icon-128.png           # App icon (128x128)
│   ├── icon-32.png            # App icon (32x32)
│   ├── screenshot-*.png       # Marketplace screenshots (4)
│   ├── banner-220x140.png     # Marketplace banner
│   ├── card-banner.png        # Marketplace card banner
│   └── demo-*.txt             # Demo video placeholders
├── store-assets/
│   └── listing.md             # Marketplace listing copy
├── tests/
│   └── imageProcessing.test.ts # Unit tests
├── scripts/
│   ├── generateAssets.ts      # Asset generation script
│   └── generateDemoVideos.ts  # Video generation script
├── package.json
├── tsconfig.json
├── webpack.config.js
├── appsscript.json            # Apps Script manifest
└── .claspignore               # Files to ignore when pushing

```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Google Apps Script project
- clasp CLI installed globally: `npm install -g @google/clasp`

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Authenticate with clasp:**
   ```bash
   clasp login
   ```

3. **Create a new Apps Script project:**
   ```bash
   clasp create --type slides --title "SlideMorph"
   ```
   
   This creates a `.clasp.json` file with your script ID.

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Push to Apps Script:**
   ```bash
   clasp push
   ```

6. **Open in Apps Script editor:**
   ```bash
   clasp open
   ```

### Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Build**: `npm run build`
3. **Push**: `clasp push`
4. **Test** in the Apps Script editor

For continuous development:
```bash
npm run watch  # Auto-rebuild on changes
```

## Testing

Run unit tests:
```bash
npm test
```

Run type checking:
```bash
npm run type-check
```

Run linter:
```bash
npm run lint
```

## Deployment

### 1. Set up the Apps Script Project

1. Create a new Google Apps Script project
2. Copy the Script ID from the project settings
3. Update `.clasp.json` with your Script ID

### 2. Configure OAuth Scopes

The `appsscript.json` file already contains the required scopes:
- `https://www.googleapis.com/auth/presentations.currentonly`
- `https://www.googleapis.com/auth/script.container.ui`

These are **intentionally restrictive** to avoid CASA (Cloud Application Security Assessment) requirements.

### 3. Build and Deploy

```bash
# Build the project
npm run build

# Push to Apps Script
clasp push

# Deploy as add-on
clasp deploy --description "SlideMorph v1.0"
```

### 4. Publish to Google Workspace Marketplace

1. **Prepare Assets** (already generated in `assets/`):
   - Icon: 128x128 and 32x32 PNG
   - Screenshots: 4 screenshots at 1280x800 with captions
   - Banner: 220x140
   - Card banner: 440x280

2. **Configure Marketplace SDK**:
   - Go to Google Cloud Console for your Apps Script project
   - Enable Google Workspace Marketplace SDK
   - Configure the listing:
     - App name: SlideMorph
     - Short description: Insert HEIC, PDF pages, SVG, WebP and AVIF images into Google Slides
     - Long description: Use content from `store-assets/listing.md`
     - Upload assets from `assets/`
     - Set category: Productivity
     - Set visibility: Public (or Private/Domain)

3. **OAuth Configuration**:
   - Add scopes in the OAuth consent screen
   - The app uses only non-restricted scopes, so no CASA required

4. **Submit for Review**:
   - Complete all required fields
   - Submit for Google's review process
   - Approval typically takes 1-3 weeks

## Assets Generation

The project includes scripts to generate all required marketplace assets:

### Visual Assets (Images)

```bash
npx ts-node scripts/generateAssets.ts
```

Generates:
- `icon-128.png` - App icon (128x128)
- `icon-32.png` - App icon (32x32)
- `screenshot-1.png` through `screenshot-4.png` - Marketplace screenshots
- `banner-220x140.png` - Marketplace banner
- `card-banner.png` - Card banner

All images are verified to not be blank (pixel variance check).

### Demo Videos

Demo video descriptions are in `assets/demo-*.txt`. These should be recorded using:
- Screen recording software (OBS Studio, QuickTime, etc.)
- Or the included Playwright script (needs DOM lib configuration)

## Architecture

### Server-Side (Code.ts)

- **Menu Creation**: `onOpen()` adds "SlideMorph" to Add-ons menu
- **Sidebar Display**: `showSidebar()` shows the HTML sidebar
- **Image Insertion**: `insertImageOnSlide()` inserts converted image
- **Image Replacement**: `replaceSelectedImage()` replaces selected image
- **Onboarding**: Tracks first-time use with UserProperties
- **Drive I/O Links**: Menu items and functions to open Drive I/O pages

### Client-Side (Sidebar.html)

- **File Selection**: Drag-and-drop or file picker
- **Format Detection**: Based on file extension
- **Conversion**:
  - HEIC/HEIF: libheif-js decoder → Canvas → PNG
  - PDF: PDF.js → Canvas (with page picker) → PNG
  - SVG: Load as image → Canvas → PNG
  - WebP/AVIF: Load as image → Canvas → PNG
- **Optimization**: Downscale if > 25 MP or > 50 MB
- **Upload**: Send data URL to server-side function
- **UI States**: Onboarding, file selection, processing, success/error

### Color Palette

- Blue: `rgba(157,214,252,1)`
- Purple: `rgb(202,160,250)`
- Gradient: `linear-gradient(135deg, rgba(209,127,247,1) 0%, rgba(157,214,252,1) 100%)`

## Drive I/O Promotion

The add-on prominently features Drive I/O:
- Onboarding screen promo box
- Sidebar footer with links
- Menu items: "Visit Drive I/O" and "Copy Folder Extension"
- All links include `?referrer=SlideMorph` tracking parameter

Links:
- Home: `https://www.driveio.io/?referrer=SlideMorph`
- Copy Folder: `https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=SlideMorph`

## Security & Privacy

- **No Server Uploads**: All image processing happens in the browser
- **Minimal Scopes**: Only `presentations.currentonly` and `script.container.ui`
- **No Data Collection**: No analytics, no tracking
- **No External APIs**: All processing libraries loaded from CDNs but run locally

## Browser Compatibility

The sidebar requires modern browser features:
- Canvas API
- File API
- Blob API
- Promises/Async-Await
- WebAssembly (for libheif)

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **File Size**: After conversion, images must be under 50 MB (Google Slides limit)
2. **Resolution**: After conversion, images must be under 25 MP (Google Slides limit)
3. **HEIC Support**: Requires WebAssembly support in browser
4. **PDF Rendering**: Large PDFs may take time to load thumbnails
5. **SVG Rasterization**: SVG is converted to PNG, losing vector benefits

## Troubleshooting

### Build Errors

**Problem**: TypeScript compilation errors  
**Solution**: Run `npm run type-check` to see detailed errors

**Problem**: Webpack build fails  
**Solution**: Clear `dist/` and rebuild: `rm -rf dist && npm run build`

### Deployment Issues

**Problem**: `clasp push` fails  
**Solution**: Re-authenticate with `clasp login` and verify `.clasp.json`

**Problem**: Functions not found in Apps Script  
**Solution**: Ensure `webpack.config.js` uses `gas-webpack-plugin` correctly

### Runtime Errors

**Problem**: "Script function not found"  
**Solution**: Rebuild and push: `npm run build && clasp push`

**Problem**: Sidebar doesn't load  
**Solution**: Check if `Sidebar.html` is in the `.claspignore` exclusions

**Problem**: Image conversion fails  
**Solution**: Check browser console for errors; ensure CDN libraries load

## License

MIT License - See LICENSE file for details

## Credits

- Built by Toriong
- Part of the Drive I/O suite
- Uses libheif-js, PDF.js, and Canvas API

## Support

For support, visit [Drive I/O](https://www.driveio.io/?referrer=SlideMorph) or file an issue on GitHub.

---

**Ready to deploy?** Follow the deployment steps above and remember to update the Apps Script project ID!
