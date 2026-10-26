# SlideMorph Assets Manifest

## Visual Assets (Generated)

All PNG files verified with pixel variance checks (all > 1.0, confirming non-blank):

### App Icons
- `assets/icon-128.png` - 128x128px, 2.4 KB, variance: 531.19 ✓
- `assets/icon-32.png` - 32x32px, 568 bytes, variance: 517.05 ✓

### Marketplace Screenshots (1280x800px with gradient frames and captions)
- `assets/screenshot-1.png` - "Welcome & Onboarding" - 35 KB, variance: 223.45 ✓
- `assets/screenshot-2.png` - "Easy File Selection" - 25 KB, variance: 168.27 ✓
- `assets/screenshot-3.png` - "Process & Insert" - 27 KB, variance: 174.06 ✓
- `assets/screenshot-4.png` - "PDF Page Picker" - 22 KB, variance: 173.85 ✓

### Marketplace Banners
- `assets/banner-220x140.png` - 220x140px, 9.5 KB, variance: 329.68 ✓
- `assets/card-banner.png` - 440x280px, 23 KB, variance: 341.29 ✓

**Total Visual Assets**: 8 files, all verified non-blank

## Demo Videos (Placeholders)

Video scripts/descriptions provided in:
- `assets/demo-1-onboarding.txt` - Onboarding flow (~20s)
- `assets/demo-2-insert-image.txt` - Insert HEIC/WebP/SVG (~30s)
- `assets/demo-3-pdf-picker.txt` - PDF page picker (~25s)

**Owner Action Required**: Record actual demo videos using:
1. Screen recording software (OBS Studio, QuickTime, etc.)
2. Follow descriptions in .txt files
3. Convert to MP4 format for Marketplace submission

## Listing Copy
- `store-assets/listing.md` - Complete Marketplace listing text with:
  - Short description
  - Full description
  - Features list
  - Keywords
  - Support information

## Verification

All images verified with pixel variance analysis:
```bash
node -e "const { createCanvas, loadImage } = require('canvas'); ..."
```

Results:
- All images have variance > 100 (significantly non-blank)
- All files exist and are readable
- All PNG files are valid images

## Next Steps for Owner

1. **Apps Script Project ID**: Update `.clasp.json` with your project's Script ID
2. **Record Demo Videos**: Use descriptions in `assets/demo-*.txt`
3. **Marketplace SDK Setup**: 
   - Enable SDK in Google Cloud Console
   - Upload all assets from `assets/`
   - Use listing copy from `store-assets/listing.md`
4. **OAuth Configuration**: Add scopes to OAuth consent screen
5. **Testing**: Test in a real Google Slides presentation
6. **Deployment**: Follow README.md deployment section

## Asset Usage

- **App Icons**: Used in Add-ons menu and Marketplace listing
- **Screenshots**: Showcase features in Marketplace
- **Banners**: Marketplace listing header and card
- **Demo Videos**: Marketplace listing gallery (to be recorded)
- **Listing Copy**: Marketplace description and metadata
