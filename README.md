# SlideMorph

A free Google Workspace editor add-on for Google Slides that converts HEIC, PDF pages, SVG, WebP, and AVIF images to PNG and inserts them directly into your presentations.

## Features

- 📸 **HEIC/HEIF Support**: Convert iPhone and iPad photos instantly
- 📄 **PDF Page Selection**: Extract and insert specific pages from PDF documents
- 🎨 **SVG Conversion**: Convert scalable vector graphics to raster images
- 🌐 **WebP & AVIF**: Support for modern web image formats
- 🔒 **Privacy-First**: All conversions happen locally in your browser
- ⚡ **Smart Processing**: Automatic optimization for Google Slides limits
- ✨ **Easy to Use**: Drag-and-drop interface with real-time preview

## Technical Stack

- **TypeScript**: Type-safe code with full Apps Script API support
- **Google Apps Script**: Server-side execution environment
- **HtmlService**: Modern sidebar UI
- **Client-side Libraries**:
  - `libheif-js`: HEIC/HEIF decoding
  - `pdf.js`: PDF page rendering
  - HTML5 Canvas: Image format conversion
- **Build Tools**: Webpack, ESLint, TypeScript compiler
- **Deployment**: Clasp (Command Line Apps Script Projects)

## Project Structure

```
slidemorph/
├── src/
│   ├── Code.ts           # Main server-side logic
│   └── Sidebar.html      # Sidebar UI with client-side conversion
├── dist/                 # Built files (generated)
├── store-assets/         # Marketplace assets
│   ├── icons/           # App icons (32, 48, 96, 128, 1024px)
│   ├── screenshots/     # Marketplace screenshots
│   ├── card-banner.png  # 220x140 card banner
│   └── listing.md       # Marketplace copy
├── demo/
│   └── videos/          # Demo videos
├── appsscript.json      # Apps Script manifest
├── package.json         # npm configuration
├── tsconfig.json        # TypeScript configuration
├── webpack.config.js    # Webpack build configuration
└── .eslintrc.json       # ESLint configuration
```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account
- Google Apps Script API enabled
- clasp CLI installed globally: `npm install -g @google/clasp`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Toriong/slidemorph.git
   cd slidemorph
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Deployment

1. Login to clasp:
   ```bash
   clasp login
   ```

2. Create a new Apps Script project:
   ```bash
   clasp create --type slides --title "SlideMorph"
   ```
   This will create a `.clasp.json` file with your script ID.

3. Push the code:
   ```bash
   npm run push
   ```

4. Deploy:
   ```bash
   clasp deploy
   ```

5. Open the Apps Script project:
   ```bash
   clasp open
   ```

### Development Workflow

- **Build**: `npm run build` - Builds TypeScript and copies files to dist/
- **Type Check**: `npm run type-check` - Runs TypeScript type checking
- **Lint**: `npm run lint` - Runs ESLint on source files
- **Test**: `npm test` - Runs lint, type-check, and build
- **Push**: `npm run push` - Builds and pushes to Apps Script
- **Deploy**: `npm run deploy` - Builds, pushes, and deploys

## OAuth Scopes

SlideMorph uses minimal, non-restricted scopes:

- `https://www.googleapis.com/auth/presentations.currentonly` - Access to current presentation only
- `https://www.googleapis.com/auth/script.container.ui` - Display sidebar UI

No Drive access, no restricted scopes - no CASA review required!

## Marketplace Assets

All required assets are included in `store-assets/`:

### Icons
- ✅ `icon-32.png` (32x32)
- ✅ `icon-48.png` (48x48)
- ✅ `icon-96.png` (96x96)
- ✅ `icon-128.png` (128x128)
- ✅ `icon-1024.png` (1024x1024)

All icons verified with pixel variance checks.

### Screenshots (1280x800 with gradient frames)
- ✅ `screenshot-1-welcome.jpg` - Welcome screen
- ✅ `screenshot-2-file-select.jpg` - File selection
- ✅ `screenshot-3-pdf-pages.jpg` - PDF page picker
- ✅ `screenshot-4-success.jpg` - Successful insertion

### Card Banner
- ✅ `card-banner.png` (220x140)

### Demo Videos
- ✅ `demo-1-heic-conversion.mp4` (20 seconds)
- ✅ `demo-2-pdf-pages.mp4` (15 seconds)
- ✅ `demo-3-multiple-formats.mp4` (18 seconds)

### Listing Copy
- ✅ `listing.md` - Complete marketplace description and metadata

## User Steps for Marketplace Submission

1. **Create GCP Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use existing
   - Enable Apps Script API

2. **Configure OAuth Consent Screen**:
   - Set application name: "SlideMorph"
   - Add application logo (icon-128.png)
   - Set support email
   - Add authorized domains
   - Configure scopes

3. **Link Apps Script Project**:
   - Open Apps Script project
   - Go to Project Settings
   - Link to your GCP project

4. **Create Privacy Policy and Terms**:
   - Host privacy policy page
   - Host terms of service page
   - Update URLs in listing

5. **Submit to Workspace Marketplace**:
   - Go to [Google Workspace Marketplace](https://console.cloud.google.com/marketplace)
   - Create new listing
   - Upload all assets from `store-assets/`
   - Fill in listing details from `listing.md`
   - Submit for review

## Drive I/O Integration

SlideMorph includes tasteful Drive I/O promotions as requested:

- Footer links in sidebar UI
- Welcome card mention
- Post-insertion promotional messages (30% probability)
- Homepage card information
- Referral links: `https://www.driveio.io/?referrer=SlideMorph`
- Copy Folder extension: `https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=SlideMorph`

## Color Scheme

- **Blue**: `rgba(157,214,252,1)`
- **Purple**: `rgb(202, 160, 250)`
- **Gradient**: `rgba(209,127,247,1)` to `rgba(157,214,252,1)`

## Browser Compatibility

Requires modern browser with:
- HTML5 Canvas API
- WebAssembly (for HEIC decoding)
- ES6+ JavaScript support

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Author

Toriong

## Support

For support, feature requests, or bug reports, please contact through the support link in the add-on.

---

**Need more Google Drive tools?** Check out [Drive I/O](https://www.driveio.io/?referrer=SlideMorph) for advanced automation features.
