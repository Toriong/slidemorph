const { chromium } = require('playwright');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function createScreenshotWithFrame(screenshotPath, title, caption, outputPath) {
  const img = await loadImage(screenshotPath);
  
  const padding = 20;
  const captionHeight = 80;
  const borderWidth = 10;
  const width = 1280;
  const height = 800;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);
  
  const gradient = ctx.createLinearGradient(0, 0, width, borderWidth);
  gradient.addColorStop(0, 'rgba(209,127,247,1)');
  gradient.addColorStop(1, 'rgba(157,214,252,1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, borderWidth);
  
  const availableHeight = height - borderWidth - captionHeight;
  const scale = Math.min((width - padding * 2) / img.width, availableHeight / img.height);
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  const x = (width - scaledWidth) / 2;
  const y = borderWidth + (availableHeight - scaledHeight) / 2;
  
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  
  const captionY = height - captionHeight;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, captionY, width, captionHeight);
  
  ctx.fillStyle = '#202124';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, captionY + 30);
  
  ctx.fillStyle = '#5f6368';
  ctx.font = '18px Arial';
  ctx.fillText(caption, width / 2, captionY + 58);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log('✓ Created ' + path.basename(outputPath));
}

async function captureScreenshot(scenario, outputPath) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();
  
  const sidebarHtml = fs.readFileSync(path.join(__dirname, '../build/Sidebar.html'), 'utf-8');
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Google Sans', 'Roboto', Arial, sans-serif; }
        body { display: flex; height: 100vh; overflow: hidden; background: #f8f9fa; }
        .slides-editor { flex: 1; display: flex; flex-direction: column; }
        .toolbar { height: 64px; background: white; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
        .toolbar-logo { font-size: 24px; }
        .toolbar-title { font-size: 18px; color: #202124; }
        .toolbar-button { padding: 8px 16px; background: #f8f9fa; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; }
        .content-area { flex: 1; display: flex; }
        .slide-panel { width: 200px; background: white; border-right: 1px solid #dadce0; padding: 16px 8px; }
        .slide-thumb { width: 184px; height: 104px; background: white; border: 2px solid #dadce0; border-radius: 4px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #5f6368; }
        .slide-thumb.active { border-color: #1a73e8; background: #e8f0fe; }
        .slide-canvas { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #f8f9fa; }
        .slide { width: 960px; height: 540px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border-radius: 2px; display: flex; align-items: center; justify-content: center; }
        .slide img { max-width: 700px; max-height: 400px; object-fit: contain; border-radius: 4px; }
        #sidebar { width: 320px; border-left: 1px solid #dadce0; background: white; overflow-y: auto; }
      </style>
    </head>
    <body>
      <div class="slides-editor">
        <div class="toolbar"><div class="toolbar-logo">🎨</div><div class="toolbar-title">Untitled presentation</div><button class="toolbar-button">File</button><button class="toolbar-button">Insert</button><button class="toolbar-button">Add-ons</button></div>
        <div class="content-area"><div class="slide-panel"><div class="slide-thumb active">Slide 1</div><div class="slide-thumb">Slide 2</div></div><div class="slide-canvas"><div class="slide" id="mainSlide"></div></div></div>
      </div>
      <div id="sidebar"></div>
    </body>
    </html>
  `);
  
  await page.evaluate((html) => { document.getElementById('sidebar').innerHTML = html; }, sidebarHtml);
  
  if (scenario === 'onboarding') {
    await page.evaluate(() => {
      const main = document.getElementById('mainContent');
      const onb = document.getElementById('onboardingScreen');
      if (main) main.classList.add('hidden');
      if (onb) onb.classList.remove('hidden');
    });
  } else if (scenario === 'file-selected') {
    await page.evaluate(() => {
      const main = document.getElementById('mainContent');
      const onb = document.getElementById('onboardingScreen');
      if (main) main.classList.remove('hidden');
      if (onb) onb.classList.add('hidden');
      const dz = document.getElementById('dropZone');
      if (dz) {
        dz.style.borderColor = 'rgba(209,127,247,1)';
        dz.style.background = 'rgba(157,214,252,0.1)';
        dz.innerHTML = '<div style="font-size: 48px; margin-bottom: 12px;">✓</div><div><strong>photo.heic</strong> selected</div>';
      }
      const st = document.getElementById('statusArea');
      if (st) st.innerHTML = '<div class="status info">Selected: photo.heic (3.2 MB)</div>';
      const ac = document.getElementById('actionSection');
      const ab = document.getElementById('actionButtons');
      if (ac) ac.classList.remove('hidden');
      if (ab) ab.classList.remove('hidden');
    });
  } else if (scenario === 'image-inserted') {
    await page.evaluate(() => {
      const main = document.getElementById('mainContent');
      const onb = document.getElementById('onboardingScreen');
      if (main) main.classList.remove('hidden');
      if (onb) onb.classList.add('hidden');
      const st = document.getElementById('statusArea');
      if (st) st.innerHTML = '<div class="status success">✓ Image inserted successfully!</div>';
      const slide = document.getElementById('mainSlide');
      if (slide) slide.innerHTML = '<img src="data:image/svg+xml,%3Csvg width=\'600\' height=\'400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'grad\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:rgba(209,127,247,0.3)\'/%3E%3Cstop offset=\'100%25\' style=\'stop-color:rgba(157,214,252,0.3)\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'600\' height=\'400\' fill=\'url(%23grad)\' rx=\'8\'/%3E%3Ctext x=\'300\' y=\'220\' font-size=\'72\' text-anchor=\'middle\' fill=\'white\'%3E📸%3C/text%3E%3C/svg%3E"/>';
    });
  } else if (scenario === 'pdf-picker') {
    await page.evaluate(() => {
      const main = document.getElementById('mainContent');
      const onb = document.getElementById('onboardingScreen');
      if (main) main.classList.remove('hidden');
      if (onb) onb.classList.add('hidden');
      const st = document.getElementById('statusArea');
      if (st) st.innerHTML = '<div class="status info">Selected page 2</div>';
      const ps = document.getElementById('pdfPagesSection');
      const pp = document.getElementById('pdfPages');
      if (ps && pp) {
        ps.classList.remove('hidden');
        pp.innerHTML = '<div style="cursor:pointer;border:2px solid transparent;border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 1</div></div><div style="cursor:pointer;border:2px solid rgba(209,127,247,1);border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 2</div></div><div style="cursor:pointer;border:2px solid transparent;border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 3</div></div><div style="cursor:pointer;border:2px solid transparent;border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 4</div></div>';
      }
      const slide = document.getElementById('mainSlide');
      if (slide) slide.innerHTML = '<img src="data:image/svg+xml,%3Csvg width=\'500\' height=\'350\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'500\' height=\'350\' fill=\'white\' stroke=\'%23dadce0\' stroke-width=\'2\' rx=\'4\'/%3E%3Ctext x=\'250\' y=\'195\' font-size=\'84\' text-anchor=\'middle\' fill=\'%235f6368\'%3E📄%3C/text%3E%3C/svg%3E"/>';
      const ac = document.getElementById('actionSection');
      const ab = document.getElementById('actionButtons');
      if (ac) ac.classList.remove('hidden');
      if (ab) ab.classList.remove('hidden');
    });
  }
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: outputPath, fullPage: false });
  await context.close();
  await browser.close();
}

async function main() {
  console.log('Generating marketplace screenshots...\n');
  const tempDir = '/tmp/screenshots';
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  
  await captureScreenshot('onboarding', path.join(tempDir, 'raw-1.png'));
  await captureScreenshot('file-selected', path.join(tempDir, 'raw-2.png'));
  await captureScreenshot('image-inserted', path.join(tempDir, 'raw-3.png'));
  await captureScreenshot('pdf-picker', path.join(tempDir, 'raw-4.png'));
  
  await createScreenshotWithFrame(path.join(tempDir, 'raw-1.png'), 'Welcome to SlideMorph', 'Get started with onboarding and Drive I/O promotion', 'branding/screenshot-1-onboarding.png');
  await createScreenshotWithFrame(path.join(tempDir, 'raw-2.png'), 'Select Image File', 'Choose HEIC, PDF, SVG, WebP, or AVIF files to convert', 'branding/screenshot-2-file-select.png');
  await createScreenshotWithFrame(path.join(tempDir, 'raw-3.png'), 'Image Inserted Successfully', 'Converted HEIC photo now appears on the slide', 'branding/screenshot-3-image-inserted.png');
  await createScreenshotWithFrame(path.join(tempDir, 'raw-4.png'), 'PDF Page Picker', 'Select any page from a PDF and insert on slide', 'branding/screenshot-4-pdf-picker.png');
  
  console.log('\n✓ All 4 marketplace screenshots generated in branding/');
}

main().catch(console.error);
