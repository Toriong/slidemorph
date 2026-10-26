# Privacy Policy for SlideMorph

**Effective Date**: October 26, 2026

## Overview

SlideMorph is a Google Workspace add-on for Google Slides that helps users insert image formats not natively supported by Google Slides (HEIC, PDF pages, SVG, WebP, AVIF). This privacy policy explains how SlideMorph handles user data.

## Data Collection and Usage

**SlideMorph does not collect, store, or transmit any user data.**

### What We Don't Do

- **No Data Collection**: We do not collect any personal information, files, or usage data
- **No Server Upload**: All image processing happens locally in your browser
- **No Third-Party Sharing**: We do not share data with third parties
- **No Analytics**: We do not use analytics or tracking tools
- **No Cookies**: We do not use cookies or similar tracking technologies

### How SlideMorph Works

1. You select an image file (HEIC, PDF, SVG, WebP, or AVIF) from your computer
2. The file is converted to PNG **entirely in your browser** using client-side JavaScript libraries
3. The converted image is inserted directly into your Google Slides presentation
4. No files are uploaded to any external server

### Required Permissions

SlideMorph requires the following Google OAuth scopes:

- `https://www.googleapis.com/auth/presentations.currentonly`: To insert images into the currently open presentation
- `https://www.googleapis.com/auth/script.container.ui`: To display the sidebar interface

These permissions are used **only** to provide core functionality and never to access or transmit your data.

### User Preferences

SlideMorph stores one piece of local preference data:

- **Onboarding Status**: Whether you've seen the welcome screen (stored in your browser's local storage)

This preference is stored locally and is not transmitted to any server.

## Data Security

Since SlideMorph performs all processing client-side and does not collect or transmit data, your files remain entirely under your control on your device and in your Google account.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date.

## Third-Party Libraries

SlideMorph uses the following client-side libraries for image conversion:

- **libheif-js**: For converting HEIC/HEIF images (loaded from CDN)
- **PDF.js**: For rendering PDF pages (loaded from CDN)
- **Canvas API**: For converting SVG, WebP, and AVIF (browser built-in)

These libraries run entirely in your browser and do not send data to external servers.

## Contact

For questions about this privacy policy or SlideMorph, please contact:

- **Drive I/O Support**: https://www.driveio.io/?referrer=SlideMorph

## Compliance

SlideMorph complies with:

- Google Workspace Marketplace Developer Program Policies
- Google API Services User Data Policy
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

By using minimal permissions and processing all data client-side, SlideMorph ensures maximum privacy and security for your files.

---

**Last Updated**: October 26, 2026
