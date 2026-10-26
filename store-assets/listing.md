# SlideMorph - Google Workspace Marketplace Listing

## App Name
SlideMorph

## Tagline
Convert and insert HEIC, PDF pages, SVG, WebP, and AVIF images into Google Slides

## Category
Productivity

## Short Description (up to 80 characters)
Convert unsupported image formats to PNG and insert them into your slides

## Description (detailed)

**SlideMorph** makes it easy to work with image formats not natively supported by Google Slides. Convert HEIC photos from your iPhone, specific pages from PDF documents, SVG vector graphics, WebP, and AVIF images directly in your browser—no uploads, no external services, just instant conversion and insertion.

### Key Features

🔄 **Universal Format Support**
- **HEIC/HEIF**: Convert iPhone and iPad photos instantly
- **PDF Pages**: Extract and insert any page from multi-page PDFs
- **SVG**: Convert scalable vector graphics to raster images
- **WebP & AVIF**: Support for modern web image formats

🔒 **Privacy-Focused**
- All conversions happen locally in your browser
- No files are uploaded to external servers
- No data leaves your device

⚡ **Smart Processing**
- Automatic downscaling for images over 25 megapixels
- Respects Google Slides size limits (under 50 MB)
- High-quality PNG output

✨ **Easy to Use**
- Drag and drop file selection
- Insert new images or replace existing ones
- Real-time preview before insertion
- PDF page picker for multi-page documents

### How It Works

1. Open SlideMorph from the Add-ons menu in Google Slides
2. Select or drag your HEIC, PDF, SVG, WebP, or AVIF file
3. For PDFs, choose which page to convert
4. Preview the converted image
5. Insert into your slide or replace a selected image

### Perfect For

- Presentations featuring iPhone photos (HEIC format)
- Inserting specific pages from PDF reports or documents
- Working with modern web image formats (WebP, AVIF)
- Converting SVG graphics for slide compatibility

### Permissions

SlideMorph uses minimal permissions:
- **presentations.currentonly**: To insert and replace images in the current presentation
- **script.container.ui**: To display the sidebar interface

No Drive access, no restricted scopes—SlideMorph doesn't need a CASA review because it only works with your current presentation.

### Support

For support, feature requests, or bug reports, please contact us through the support link.

---

**Need more Google Drive automation?** Check out [Drive I/O](https://www.driveio.io/?referrer=SlideMorph) for advanced tools including bulk operations, folder copying, and more.

## Screenshots

1. **Welcome Screen** - Convert unsupported image formats in your browser
2. **File Selection** - Select HEIC, PDF, SVG, WebP, or AVIF files
3. **PDF Page Picker** - Pick any page from multi-page PDFs
4. **Successful Insertion** - Insert or replace images instantly

## Demo Videos

1. **HEIC Conversion and Insert** (20 seconds) - Shows the complete workflow of selecting a HEIC photo, converting it, and inserting it into a slide
2. **PDF Page Selection** (15 seconds) - Demonstrates selecting a specific page from a multi-page PDF and inserting it
3. **Multiple Format Support** (18 seconds) - Showcases conversion of SVG, WebP, and AVIF formats

## Developer Information

**Developer**: Toriong
**Website**: https://www.driveio.io/?referrer=SlideMorph
**Privacy Policy URL**: [Your privacy policy URL]
**Terms of Service URL**: [Your terms of service URL]

## Pricing

Free

## Search Keywords

- image conversion
- HEIC to PNG
- PDF to image
- SVG converter
- WebP to PNG
- AVIF converter
- iPhone photos
- Google Slides images
- presentation images
- image format converter

## Installation Instructions

1. Install SlideMorph from the Google Workspace Marketplace
2. Open any Google Slides presentation
3. Click **Add-ons** → **SlideMorph** → **Open SlideMorph**
4. Start converting and inserting images!

## Technical Details

- All conversions happen client-side using browser technologies
- Uses libheif.js for HEIC/HEIF decoding
- PDF.js for PDF page rendering
- HTML5 Canvas for SVG, WebP, and AVIF conversion
- Automatic image optimization to meet Google Slides limits

## Assets Checklist

### Icons
- ✅ icon-32.png (32x32)
- ✅ icon-48.png (48x48)
- ✅ icon-96.png (96x96)
- ✅ icon-128.png (128x128)
- ✅ icon-1024.png (1024x1024, source)

### Screenshots (1280x800 with gradient frames)
- ✅ screenshot-1-welcome.jpg - Welcome screen
- ✅ screenshot-2-file-select.jpg - File selection
- ✅ screenshot-3-pdf-pages.jpg - PDF page picker
- ✅ screenshot-4-success.jpg - Successful insertion

### Banner
- ✅ card-banner.png (220x140)

### Demo Videos
- ✅ demo-1-heic-conversion.mp4 (20s)
- ✅ demo-2-pdf-pages.mp4 (15s)
- ✅ demo-3-multiple-formats.mp4 (18s)

## Next Steps (User Actions Required)

1. **Set up GCP project**: Create a Google Cloud Platform project and enable Apps Script API
2. **Configure OAuth consent screen**: Set up the OAuth consent screen with app information
3. **Deploy with clasp**: 
   ```bash
   npm install
   npm run build
   clasp login
   clasp create --type slides --title "SlideMorph"
   clasp push
   clasp deploy
   ```
4. **Test the add-on**: Test in Google Slides to ensure all functionality works
5. **Create privacy policy and terms**: Host privacy policy and terms of service pages
6. **Submit to Workspace Marketplace**: Upload all assets and submit for review

## Drive I/O Integration

SlideMorph includes tasteful Drive I/O promotions:
- Footer links in the sidebar
- Welcome card mention
- Post-insertion promotional message (30% probability)
- Homepage card information
- Links to: https://www.driveio.io/?referrer=SlideMorph
- Copy Folder extension: https://www.driveio.io/standalone-plans/copy-folder-in-google-drive-extension?referrer=SlideMorph
