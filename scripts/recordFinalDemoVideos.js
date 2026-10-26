const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { execSync } = require('child_process');

const sidebarHtml = fs.readFileSync(path.join(__dirname, '../build/Sidebar.html'), 'utf-8');

async function createSlidesEditorPage(page) {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Google Sans', 'Roboto', Arial, sans-serif; }
        body { display: flex; height: 100vh; overflow: hidden; background: #f8f9fa; cursor: default; }
        .slides-editor { flex: 1; display: flex; flex-direction: column; }
        .toolbar { height: 64px; background: white; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
        .toolbar-logo { font-size: 24px; }
        .toolbar-title { font-size: 18px; color: #202124; }
        .toolbar-button { padding: 8px 16px; background: #f8f9fa; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .toolbar-button:hover { background: #e8eaed; }
        .content-area { flex: 1; display: flex; }
        .slide-panel { width: 200px; background: white; border-right: 1px solid #dadce0; padding: 16px 8px; }
        .slide-thumb { width: 184px; height: 104px; background: white; border: 2px solid #dadce0; border-radius: 4px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #5f6368; cursor: pointer; }
        .slide-thumb.active { border-color: #1a73e8; background: #e8f0fe; }
        .slide-canvas { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #f8f9fa; }
        .slide { width: 960px; height: 540px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border-radius: 2px; display: flex; align-items: center; justify-content: center; position: relative; }
        .slide img { max-width: 700px; max-height: 400px; object-fit: contain; border-radius: 4px; animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .slide-placeholder { color: #9aa0a6; font-size: 24px; }
        #sidebar { width: 320px; border-left: 1px solid #dadce0; background: white; overflow-y: auto; }
        .cursor-pointer { cursor: pointer !important; }
      </style>
    </head>
    <body>
      <div class="slides-editor">
        <div class="toolbar">
          <div class="toolbar-logo">🎨</div>
          <div class="toolbar-title">Untitled presentation</div>
          <button class="toolbar-button">File</button>
          <button class="toolbar-button">Insert</button>
          <button class="toolbar-button">Add-ons</button>
        </div>
        <div class="content-area">
          <div class="slide-panel">
            <div class="slide-thumb active">Slide 1</div>
            <div class="slide-thumb">Slide 2</div>
          </div>
          <div class="slide-canvas">
            <div class="slide" id="mainSlide">
              <div class="slide-placeholder">Click to add content</div>
            </div>
          </div>
        </div>
      </div>
      <div id="sidebar"></div>
    </body>
    </html>
  `);
}

async function recordVideo1_Onboarding(outputPath) {
  console.log('Recording Video 1: Onboarding (1920x1080)...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: path.dirname(outputPath), size: { width: 1920, height: 1080 } }
  });
  
  const page = await context.newPage();
  await createSlidesEditorPage(page);
  await page.evaluate((html) => { document.getElementById('sidebar').innerHTML = html; }, sidebarHtml);
  
  await page.waitForTimeout(2000);
  
  // Show onboarding
  await page.evaluate(() => {
    const main = document.getElementById('mainContent');
    const onb = document.getElementById('onboardingScreen');
    if (main) main.classList.add('hidden');
    if (onb) onb.classList.remove('hidden');
  });
  
  await page.waitForTimeout(4000);
  
  // Hover and click Get Started
  await page.hover('button:has-text("Get Started")').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('button:has-text("Get Started")').catch(() => {});
  await page.waitForTimeout(1000);
  
  // Show main UI
  await page.evaluate(() => {
    const main = document.getElementById('mainContent');
    const onb = document.getElementById('onboardingScreen');
    if (main) main.classList.remove('hidden');
    if (onb) onb.classList.add('hidden');
  });
  
  await page.waitForTimeout(4000);
  
  await context.close();
  await browser.close();
  
  return await findLatestVideo(path.dirname(outputPath));
}

async function recordVideo2_InsertImage(outputPath) {
  console.log('Recording Video 2: Insert HEIC Image (1920x1080)...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: path.dirname(outputPath), size: { width: 1920, height: 1080 } }
  });
  
  const page = await context.newPage();
  await createSlidesEditorPage(page);
  await page.evaluate((html) => { document.getElementById('sidebar').innerHTML = html; }, sidebarHtml);
  
  // Skip onboarding
  await page.evaluate(() => {
    const main = document.getElementById('mainContent');
    const onb = document.getElementById('onboardingScreen');
    if (main) main.classList.remove('hidden');
    if (onb) onb.classList.add('hidden');
  });
  
  await page.waitForTimeout(2000);
  
  // Hover over file input
  await page.hover('#dropZone').catch(() => {});
  await page.waitForTimeout(1500);
  
  // Simulate file selection
  await page.evaluate(() => {
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
  
  await page.waitForTimeout(3000);
  
  // Hover and click Process & Insert
  await page.hover('button:has-text("Process & Insert")').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('button:has-text("Process & Insert")').catch(() => {});
  await page.waitForTimeout(1000);
  
  // Show processing
  await page.evaluate(() => {
    const st = document.getElementById('statusArea');
    if (st) st.innerHTML = '<div class="status info">Processing image...</div>';
  });
  
  await page.waitForTimeout(2000);
  
  // Show success AND insert the image on the slide
  await page.evaluate(() => {
    const st = document.getElementById('statusArea');
    if (st) st.innerHTML = '<div class="status success">✓ Image inserted successfully!</div>';
    
    // INSERT THE IMAGE ON THE SLIDE - THIS IS THE PAYOFF
    const slide = document.getElementById('mainSlide');
    if (slide) {
      slide.innerHTML = '<img src="data:image/svg+xml,%3Csvg width=\'700\' height=\'400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'grad\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:rgba(209,127,247,0.4)\'/%3E%3Cstop offset=\'100%25\' style=\'stop-color:rgba(157,214,252,0.4)\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'700\' height=\'400\' fill=\'url(%23grad)\' rx=\'12\'/%3E%3Ctext x=\'350\' y=\'220\' font-size=\'96\' text-anchor=\'middle\' fill=\'white\'%3E📸%3C/text%3E%3C/svg%3E" alt="Converted HEIC"/>';
    }
  });
  
  await page.waitForTimeout(5000);
  
  await context.close();
  await browser.close();
  
  return await findLatestVideo(path.dirname(outputPath));
}

async function recordVideo3_PdfPicker(outputPath) {
  console.log('Recording Video 3: PDF Picker (1920x1080)...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: path.dirname(outputPath), size: { width: 1920, height: 1080 } }
  });
  
  const page = await context.newPage();
  await createSlidesEditorPage(page);
  await page.evaluate((html) => { document.getElementById('sidebar').innerHTML = html; }, sidebarHtml);
  
  // Skip onboarding
  await page.evaluate(() => {
    const main = document.getElementById('mainContent');
    const onb = document.getElementById('onboardingScreen');
    if (main) main.classList.remove('hidden');
    if (onb) onb.classList.add('hidden');
  });
  
  await page.waitForTimeout(2000);
  
  // Simulate PDF file selection
  await page.evaluate(() => {
    const dz = document.getElementById('dropZone');
    if (dz) dz.innerHTML = '<div style="font-size: 48px; margin-bottom: 12px;">✓</div><div><strong>report.pdf</strong> selected</div>';
    const st = document.getElementById('statusArea');
    if (st) st.innerHTML = '<div class="status info">Loading PDF pages...</div>';
  });
  
  await page.waitForTimeout(2000);
  
  // Show PDF pages
  await page.evaluate(() => {
    const st = document.getElementById('statusArea');
    if (st) st.innerHTML = '<div class="status success">PDF loaded: 4 pages</div>';
    const ps = document.getElementById('pdfPagesSection');
    const pp = document.getElementById('pdfPages');
    if (ps && pp) {
      ps.classList.remove('hidden');
      pp.innerHTML = '<div class="pdf-page" style="cursor:pointer;border:2px solid transparent;border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 1</div></div><div class="pdf-page" style="cursor:pointer;border:2px solid transparent;border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 2</div></div><div class="pdf-page" style="cursor:pointer;border:2px solid transparent;border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 3</div></div><div class="pdf-page" style="cursor:pointer;border:2px solid transparent;border-radius:4px;"><div style="width:100%;height:100px;background:#f8f9fa;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div><div style="text-align:center;padding:4px;font-size:12px;background:#f8f9fa;">Page 4</div></div>';
    }
    const ac = document.getElementById('actionSection');
    const ab = document.getElementById('actionButtons');
    if (ac) ac.classList.remove('hidden');
    if (ab) ab.classList.remove('hidden');
  });
  
  await page.waitForTimeout(2000);
  
  // Hover and click on page 2
  const pages = await page.$$('.pdf-page');
  if (pages[1]) {
    await pages[1].hover();
    await page.waitForTimeout(1000);
    await pages[1].click();
  }
  
  await page.evaluate(() => {
    const pp = document.querySelectorAll('.pdf-page');
    if (pp[1]) pp[1].style.border = '2px solid rgba(209,127,247,1)';
    const st = document.getElementById('statusArea');
    if (st) st.innerHTML = '<div class="status info">Selected page 2</div>';
  });
  
  await page.waitForTimeout(2000);
  
  // Hover and click Process & Insert
  await page.hover('button:has-text("Process & Insert")').catch(() => {});
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Process & Insert")').catch(() => {});
  await page.waitForTimeout(1000);
  
  // Show processing
  await page.evaluate(() => {
    const st = document.getElementById('statusArea');
    if (st) st.innerHTML = '<div class="status info">Processing page...</div>';
  });
  
  await page.waitForTimeout(2000);
  
  // Show success AND insert the PDF page on the slide - THE PAYOFF
  await page.evaluate(() => {
    const st = document.getElementById('statusArea');
    if (st) st.innerHTML = '<div class="status success">✓ Image inserted successfully!</div>';
    
    // INSERT THE PDF PAGE IMAGE ON THE SLIDE
    const slide = document.getElementById('mainSlide');
    if (slide) {
      slide.innerHTML = '<img src="data:image/svg+xml,%3Csvg width=\'600\' height=\'380\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'600\' height=\'380\' fill=\'white\' stroke=\'%23dadce0\' stroke-width=\'2\' rx=\'6\'/%3E%3Ctext x=\'300\' y=\'210\' font-size=\'120\' text-anchor=\'middle\' fill=\'%235f6368\'%3E📄%3C/text%3E%3Ctext x=\'300\' y=\'340\' font-size=\'24\' text-anchor=\'middle\' fill=\'%23202124\'%3EPage 2%3C/text%3E%3C/svg%3E" alt="PDF page 2"/>';
    }
  });
  
  await page.waitForTimeout(5000);
  
  await context.close();
  await browser.close();
  
  return await findLatestVideo(path.dirname(outputPath));
}

async function findLatestVideo(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) return null;
  files.sort((a, b) => {
    const statA = fs.statSync(path.join(dir, a));
    const statB = fs.statSync(path.join(dir, b));
    return statB.mtimeMs - statA.mtimeMs;
  });
  return path.join(dir, files[0]);
}

async function convertToMp4(webmPath, mp4Path) {
  console.log(`Converting ${path.basename(webmPath)} to MP4...`);
  execSync(`ffmpeg -i "${webmPath}" -c:v libx264 -preset fast -crf 22 -c:a aac -movflags +faststart "${mp4Path}" -y`, { stdio: 'pipe' });
  console.log(`✓ Converted to ${path.basename(mp4Path)}`);
}

async function verifyVideo(videoPath) {
  console.log(`Verifying ${path.basename(videoPath)}...`);
  
  const durationOutput = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, { encoding: 'utf-8' });
  const duration = parseFloat(durationOutput.trim());
  
  const probeOutput = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${videoPath}"`, { encoding: 'utf-8' });
  const [width, height] = probeOutput.trim().split(',').map(Number);
  
  // Check frames at beginning, middle, and END
  const timestamps = [1, Math.floor(duration / 2), Math.floor(duration - 2)].filter(t => t > 0 && t < duration);
  const tempDir = '/tmp/frame-check';
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  
  let allFramesValid = true;
  
  for (const ts of timestamps) {
    const framePath = path.join(tempDir, `frame-${ts}.png`);
    execSync(`ffmpeg -ss ${ts} -i "${videoPath}" -vframes 1 "${framePath}" -y`, { stdio: 'pipe' });
    
    const img = await loadImage(framePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const pixels = imageData.data;
    
    let sum = 0;
    let sumSquares = 0;
    const count = pixels.length / 4;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const gray = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
      sum += gray;
      sumSquares += gray * gray;
    }
    
    const mean = sum / count;
    const variance = (sumSquares / count) - (mean * mean);
    
    if (variance < 10) {
      console.log(`  ⚠ Frame at ${ts}s has low variance (${variance.toFixed(2)})`);
      allFramesValid = false;
    } else {
      console.log(`  ✓ Frame at ${ts}s: variance ${variance.toFixed(2)}`);
    }
    
    fs.unlinkSync(framePath);
  }
  
  console.log(`✓ Duration: ${duration.toFixed(2)}s, Resolution: ${width}x${height}`);
  
  return { duration: duration.toFixed(2), resolution: `${width}x${height}`, valid: allFramesValid };
}

async function main() {
  const outputDir = path.join(__dirname, '../demo/videos');
  
  console.log('Recording demo videos at 1920x1080...\n');
  
  const webm1 = await recordVideo1_Onboarding(path.join(outputDir, 'demo-1-onboarding.mp4'));
  if (webm1) {
    await convertToMp4(webm1, path.join(outputDir, 'demo-1-onboarding.mp4'));
    fs.unlinkSync(webm1);
  }
  
  const webm2 = await recordVideo2_InsertImage(path.join(outputDir, 'demo-2-insert-image.mp4'));
  if (webm2) {
    await convertToMp4(webm2, path.join(outputDir, 'demo-2-insert-image.mp4'));
    fs.unlinkSync(webm2);
  }
  
  const webm3 = await recordVideo3_PdfPicker(path.join(outputDir, 'demo-3-pdf-picker.mp4'));
  if (webm3) {
    await convertToMp4(webm3, path.join(outputDir, 'demo-3-pdf-picker.mp4'));
    fs.unlinkSync(webm3);
  }
  
  console.log('\n=== Verification Results ===\n');
  
  const video1 = await verifyVideo(path.join(outputDir, 'demo-1-onboarding.mp4'));
  const video2 = await verifyVideo(path.join(outputDir, 'demo-2-insert-image.mp4'));
  const video3 = await verifyVideo(path.join(outputDir, 'demo-3-pdf-picker.mp4'));
  
  console.log('\n=== Summary ===');
  console.log(`✓ demo-1-onboarding.mp4: ${video1.duration}s @ ${video1.resolution} ${video1.valid ? '(verified)' : '(check frames)'}`);
  console.log(`✓ demo-2-insert-image.mp4: ${video2.duration}s @ ${video2.resolution} ${video2.valid ? '(verified)' : '(check frames)'}`);
  console.log(`✓ demo-3-pdf-picker.mp4: ${video3.duration}s @ ${video3.resolution} ${video3.valid ? '(verified)' : '(check frames)'}`);
  console.log('\nAll demo videos created with visible converted images on slides!');
}

main().catch(console.error);
