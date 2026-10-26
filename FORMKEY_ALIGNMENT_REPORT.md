# SlideMorph - Formkey Convention Alignment Report

## ✅ All Formkey Conventions Applied

### Major Changes Made

#### 1. Build System: Webpack → TypeScript Compiler (tsc)

**Before** (webpack + gas-webpack-plugin):
- webpack.config.js with gas-webpack-plugin
- Complex bundling process
- Single output file

**After** (formkey convention):
- Plain `tsc` compilation
- Scripts: `build = "tsc && npm run copy-html"`
- Scripts: `copy-html = "cp src/*.html build/ 2>/dev/null || true"`
- Scripts: `push = "npm run build && clasp push"`
- Scripts: `deploy = "npm run build && clasp push && clasp deploy"`
- Output: `build/` directory (not `dist/`)

**Removed**:
- webpack.config.js
- .eslintrc.js
- gas-webpack-plugin dependency

**Updated**:
- package.json: removed webpack deps, added only @types/google-apps-script, typescript, @google/clasp
- tsconfig.json: output to build/, clean ES2020 modules
- .claspignore: now excludes everything except build/ and appsscript.json

#### 2. Branding Folder Structure

**Created `branding/` with formkey naming convention**:
```
branding/
├── logo-128.png              (was: assets/icon-128.png)
├── logo-96.png               (new, generated)
├── logo-32.png               (was: assets/icon-32.png)
├── slidemorph-512.png        (was: store-assets/icon-512.png)
├── slidemorph.svg            (new, SVG version)
├── slidemorph-small.svg      (new, small SVG)
└── card-banner-220x140.png   (was: assets/banner-220x140.png)
```

**Removed**:
- assets/ folder (screenshots moved, rest removed)
- store-assets/ folder (listing.md removed, icon moved)

#### 3. Added PRIVACY.md

Comprehensive privacy policy matching formkey structure:
- Overview
- Data Collection and Usage (none)
- Required Permissions (presentations.currentonly, script.container.ui)
- Data Security
- Third-Party Libraries (client-side only)
- Compliance (GDPR, CCPA, Google policies)

#### 4. Constants Pattern (from formkey)

**Created `src/constants.ts`**:
```typescript
export const PROPERTIES_KEY = 'hasSeenOnboarding';
export const DRIVE_IO_HOME = 'https://www.driveio.io/?referrer=SlideMorph';
export const DRIVE_IO_COPY_FOLDER = '...?referrer=SlideMorph';
export const APP_NAME = 'SlideMorph';
export const APP_VERSION = '1.0.0';
```

**Updated `src/Code.ts`**:
- Now imports from constants.ts
- Follows formkey pattern for Drive I/O promotion

#### 5. README Structure Aligned

Updated to match formkey layout:
- Project structure section shows formkey-style layout
- Build instructions use tsc commands
- Development workflow matches formkey
- Client-side libraries noted as CDN-loaded

#### 6. Re-recorded Video 2

**Before**: 12.56s (too short)
**After**: 18.12s (within 15-40s requirement)

**All 3 videos now in range**:
- Video 1: 15.76s ✓
- Video 2: 18.12s ✓ (re-recorded)
- Video 3: 15.32s ✓

### Verification Results

#### Build & Tests
```
✓ npm run build: PASS
✓ npm run type-check: PASS
✓ npm test: PASS (13/13 tests)
```

#### Video Frame Verification
```
Video 1 (demo-1-onboarding.mp4): 15.76s
  Frame at 1s: variance 213.82 ✓
  Frame at 7s: variance 213.94 ✓
  Frame at 14s: variance 140.89 ✓

Video 2 (demo-2-insert-image.mp4): 18.12s [RE-RECORDED]
  Frame at 1s: variance 140.30 ✓
  Frame at 9s: variance 164.80 ✓
  Frame at 17s: variance 221.03 ✓

Video 3 (demo-3-pdf-picker.mp4): 15.32s
  Frame at 1s: variance 140.02 ✓
  Frame at 7s: variance 175.61 ✓
  Frame at 14s: variance 169.01 ✓
```

All frames verified non-blank (variance >> 10).

### Project Structure (After Alignment)

```
slidemorph/
├── .clasp.json                 # clasp config (not in repo)
├── .gitignore                  # Updated for build/ not dist/
├── PRIVACY.md                  # NEW: Privacy policy ✓
├── README.md                   # Updated structure ✓
├── appsscript.json             # Apps Script manifest
├── package.json                # Simplified deps ✓
├── tsconfig.json               # Output to build/ ✓
├── src/
│   ├── Code.ts                 # Updated with imports ✓
│   ├── Sidebar.html            # Unchanged
│   └── constants.ts            # NEW: Drive I/O constants ✓
├── build/                      # NEW: tsc output (gitignored) ✓
│   ├── Code.js
│   ├── constants.js
│   └── Sidebar.html
├── branding/                   # NEW: formkey naming ✓
│   ├── logo-128.png
│   ├── logo-96.png
│   ├── logo-32.png
│   ├── slidemorph-512.png
│   ├── slidemorph.svg
│   ├── slidemorph-small.svg
│   └── card-banner-220x140.png
├── demo/
│   └── videos/
│       ├── demo-1-onboarding.mp4 (15.76s, 150 KB)
│       ├── demo-2-insert-image.mp4 (18.12s, 180 KB) ← re-recorded
│       └── demo-3-pdf-picker.mp4 (15.32s, 163 KB)
├── tests/
│   └── imageProcessing.test.ts
└── scripts/
    ├── generateAssets.ts
    └── recordDemoVideos.js
```

### File Count

**Before alignment**: 31 files
**After alignment**: 29 files
- Removed: webpack.config.js, .eslintrc.js, old asset folders
- Added: PRIVACY.md, src/constants.ts, branding/ folder
- Reorganized: All branding assets follow formkey naming

### What Was Matched from Formkey

1. ✅ **Build system**: Plain `tsc` with copy-html script
2. ✅ **Package.json scripts**: build, copy-html, push, deploy
3. ✅ **Dependencies**: Only @types/google-apps-script, typescript, @google/clasp
4. ✅ **Branding folder**: Exact naming (logo-*, {name}-512.png, *.svg)
5. ✅ **PRIVACY.md**: Comprehensive privacy policy
6. ✅ **constants.ts**: Drive I/O promo pattern with referrer=SlideMorph
7. ✅ **README structure**: Matches formkey layout
8. ✅ **Build output**: build/ directory (not dist/)
9. ✅ **.claspignore**: Only build/ and appsscript.json pushed

### Summary

✅ Build system converted from webpack to tsc  
✅ Branding folder created with formkey naming  
✅ PRIVACY.md added  
✅ constants.ts created with Drive I/O pattern  
✅ README aligned to formkey structure  
✅ Video 2 re-recorded (now 18.12s)  
✅ All builds pass  
✅ All tests pass (13/13)  
✅ All video frames verified non-blank  

**Total alignment**: 100% to formkey convention

---

**PR**: https://github.com/Toriong/slidemorph/pull/1  
**Branch**: cursor/slidemorph-add-on-e96c  
**Commit**: "Align to formkey convention: tsc build, branding folder, PRIVACY.md"
