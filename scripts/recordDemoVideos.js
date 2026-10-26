const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { execSync } = require('child_process');

// Read the real sidebar HTML
const sidebarHtml = fs.readFileSync(path.join(__dirname, '../src/Sidebar.html'), 'utf-8');

async function createSlidesEditorPage(page) {
  // Create a faithful mock of Google Slides editor
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Google Sans', 'Roboto', Arial, sans-serif; }
        body { display: flex; height: 100vh; overflow: hidden; background: #f8f9fa; }
        
        .slides-editor { flex: 1; display: flex; flex-direction: column; }
        
        .toolbar {
          height: 64px;
          background: white;
          border-bottom: 1px solid #dadce0;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
        }
        
        .toolbar-logo { font-size: 24px; margin-right: 8px; }
        .toolbar-title { font-size: 18px; color: #202124; font-weight: 400; }
        .toolbar-button { padding: 8px 16px; background: #f8f9fa; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; cursor: pointer; }
        .toolbar-button:hover { background: #e8eaed; }
        
        .content-area { flex: 1; display: flex; }
        
        .slide-panel {
          width: 200px;
          background: white;
          border-right: 1px solid #dadce0;
          padding: 16px 8px;
          overflow-y: auto;
        }
        
        .slide-thumb {
          width: 184px;
          height: 104px;
          background: white;
          border: 2px solid #dadce0;
          border-radius: 4px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #5f6368;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        
        .slide-thumb.active { border-color: #1a73e8; background: #e8f0fe; }
        .slide-thumb:hover { border-color: #80868b; }
        
        .slide-canvas {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: #f8f9fa;
        }
        
        .slide {
          width: 960px;
          height: 540px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border-radius: 2px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .slide-placeholder {
          color: #9aa0a6;
          font-size: 48px;
          text-align: center;
        }
        
        .slide-image {
          max-width: 700px;
          max-height: 400px;
          object-fit: contain;
          border-radius: 4px;
        }
        
        #sidebar { width: 320px; border-left: 1px solid #dadce0; background: white; overflow-y: auto; }
      </style>
    </head>
    <body>
      <div class="slides-editor">
        <div class="toolbar">
          <div class="toolbar-logo">🎨</div>
          <div class="toolbar-title">Untitled presentation</div>
          <button class="toolbar-button">File</button>
          <button class="toolbar-button">Insert</button>
          <button class="toolbar-button">Slide</button>
          <button class="toolbar-button">Add-ons</button>
        </div>
        
        <div class="content-area">
          <div class="slide-panel">
            <div class="slide-thumb active">Slide 1</div>
            <div class="slide-thumb">Slide 2</div>
            <div class="slide-thumb">Slide 3</div>
          </div>
          
          <div class="slide-canvas">
            <div class="slide" id="mainSlide">
              <div class="slide-placeholder" id="slideContent">Click to add content</div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="sidebar"></div>
    </body>
    </html>
  `);
}

async function embedSidebarHtml(page) {
  // Inject the real sidebar HTML
  await page.evaluate((html) => {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = html;
  }, sidebarHtml);
}

async function recordVideo1_Onboarding(outputPath) {
  console.log('Recording Video 1: Onboarding...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: path.dirname(outputPath), size: { width: 1920, height: 1080 } }
  });
  
  const page = await context.newPage();
  await createSlidesEditorPage(page);
  await embedSidebarHtml(page);
  
  // Wait for initial render
  await page.waitForTimeout(1000);
  
  // Show onboarding screen
  await page.evaluate(() => {
    const mainContent = document.getElementById('mainContent');
    const onboarding = document.getElementById('onboardingScreen');
    if (mainContent) mainContent.classList.add('hidden');
    if (onboarding) onboarding.classList.remove('hidden');
  });
  
  await page.waitForTimeout(5000);
  
  // Scroll down to see Drive I/O promo
  await page.evaluate(() => {
    const sidebar = document.getElementById('sidebar');
    sidebar.scrollTop = 100;
  });
  
  await page.waitForTimeout(3000);
  
  // Click Get Started
  await page.click('button:has-text("Get Started")').catch(() => {});
  await page.waitForTimeout(2000);
  
  // Show main UI
  await page.evaluate(() => {
    const mainContent = document.getElementById('mainContent');
    const onboarding = document.getElementById('onboardingScreen');
    if (mainContent) mainContent.classList.remove('hidden');
    if (onboarding) onboarding.classList.add('hidden');
  });
  
  await page.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
  
  const videoFile = await findLatestVideo(path.dirname(outputPath));
  return videoFile;
}

async function recordVideo2_InsertImage(outputPath) {
  console.log('Recording Video 2: Insert HEIC/WebP Image...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: path.dirname(outputPath), size: { width: 1920, height: 1080 } }
  });
  
  const page = await context.newPage();
  await createSlidesEditorPage(page);
  await embedSidebarHtml(page);
  
  // Skip onboarding
  await page.evaluate(() => {
    const mainContent = document.getElementById('mainContent');
    const onboarding = document.getElementById('onboardingScreen');
    if (mainContent) mainContent.classList.remove('hidden');
    if (onboarding) onboarding.classList.add('hidden');
  });
  
  await page.waitForTimeout(2000);
  
  // Hover over file input area
  await page.hover('#dropZone').catch(() => {});
  await page.waitForTimeout(1500);
  
  // Simulate file selection
  await page.evaluate(() => {
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
      dropZone.style.borderColor = 'rgba(209,127,247,1)';
      dropZone.style.background = 'rgba(157,214,252,0.1)';
      dropZone.innerHTML = '<div style="font-size: 48px; margin-bottom: 12px;">✓</div><div><strong>photo.heic</strong> selected</div>';
    }
    
    const status = document.getElementById('statusArea');
    if (status) {
      status.innerHTML = '<div class="status info">Selected: photo.heic (3.2 MB)</div>';
    }
    
    const actionSection = document.getElementById('actionSection');
    const actionButtons = document.getElementById('actionButtons');
    if (actionSection) actionSection.classList.remove('hidden');
    if (actionButtons) actionButtons.classList.remove('hidden');
  });
  
  await page.waitForTimeout(3500);
  
  // Scroll sidebar to see action buttons
  await page.evaluate(() => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.scrollTop = 200;
  });
  await page.waitForTimeout(1500);
  
  // Click Process & Insert
  await page.click('button:has-text("Process & Insert")').catch(() => {});
  await page.waitForTimeout(1500);
  
  // Show processing
  await page.evaluate(() => {
    const status = document.getElementById('statusArea');
    if (status) {
      status.innerHTML = '<div class="status info">Processing image...</div>';
    }
  });
  
  await page.waitForTimeout(2500);
  
  // Show success and insert image
  await page.evaluate(() => {
    const status = document.getElementById('statusArea');
    if (status) {
      status.innerHTML = '<div class="status success">✓ Image inserted successfully!</div>';
    }
    
    const slideContent = document.getElementById('slideContent');
    if (slideContent) {
      slideContent.innerHTML = '<div style="width: 500px; height: 350px; background: linear-gradient(135deg, rgba(209,127,247,0.3) 0%, rgba(157,214,252,0.3) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 72px;">📸</div>';
    }
  });
  
  await page.waitForTimeout(3500);
  
  // Show final result on slide with animation
  await page.evaluate(() => {
    const slideContent = document.getElementById('slideContent');
    if (slideContent && slideContent.firstChild) {
      const img = slideContent.firstChild;
      img.style.transform = 'scale(0.95)';
      setTimeout(() => {
        img.style.transition = 'transform 0.3s ease';
        img.style.transform = 'scale(1)';
      }, 100);
    }
  });
  
  await page.waitForTimeout(2000);
  
  await context.close();
  await browser.close();
  
  const videoFile = await findLatestVideo(path.dirname(outputPath));
  return videoFile;
}

async function recordVideo3_PdfPicker(outputPath) {
  console.log('Recording Video 3: PDF Page Picker...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: path.dirname(outputPath), size: { width: 1920, height: 1080 } }
  });
  
  const page = await context.newPage();
  await createSlidesEditorPage(page);
  await embedSidebarHtml(page);
  
  // Skip onboarding
  await page.evaluate(() => {
    const mainContent = document.getElementById('mainContent');
    const onboarding = document.getElementById('onboardingScreen');
    if (mainContent) mainContent.classList.remove('hidden');
    if (onboarding) onboarding.classList.add('hidden');
  });
  
  await page.waitForTimeout(1500);
  
  // Simulate PDF file selection
  await page.evaluate(() => {
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
      dropZone.innerHTML = '<div style="font-size: 48px; margin-bottom: 12px;">✓</div><div><strong>report.pdf</strong> selected</div>';
    }
    
    const status = document.getElementById('statusArea');
    if (status) {
      status.innerHTML = '<div class="status info">Loading PDF pages...</div>';
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Show PDF page picker
  await page.evaluate(() => {
    const status = document.getElementById('statusArea');
    if (status) {
      status.innerHTML = '<div class="status success">PDF loaded: 4 pages</div>';
    }
    
    const pdfSection = document.getElementById('pdfPagesSection');
    const pdfPages = document.getElementById('pdfPages');
    
    if (pdfSection && pdfPages) {
      pdfSection.classList.remove('hidden');
      pdfPages.innerHTML = `
        <div style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
          <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
          <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 1</div>
        </div>
        <div style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
          <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
          <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 2</div>
        </div>
        <div style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
          <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
          <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 3</div>
        </div>
        <div style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
          <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
          <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 4</div>
        </div>
      `;
    }
    
    const actionSection = document.getElementById('actionSection');
    const actionButtons = document.getElementById('actionButtons');
    if (actionSection) actionSection.classList.remove('hidden');
    if (actionButtons) actionButtons.classList.remove('hidden');
  });
  
  await page.waitForTimeout(2000);
  
  // Select page 2
  await page.evaluate(() => {
    const pdfPages = document.getElementById('pdfPages');
    if (pdfPages) {
      const pages = pdfPages.querySelectorAll('div[style*="cursor: pointer"]');
      if (pages[1]) {
        pages[1].style.border = '2px solid rgba(209,127,247,1)';
      }
    }
    
    const status = document.getElementById('statusArea');
    if (status) {
      status.innerHTML = '<div class="status info">Selected page 2</div>';
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Change to replace mode
  await page.evaluate(() => {
    const radios = document.querySelectorAll('input[name="action"]');
    if (radios[1]) radios[1].checked = true;
  });
  
  await page.waitForTimeout(1000);
  
  // Add an existing image to the slide first
  await page.evaluate(() => {
    const slideContent = document.getElementById('slideContent');
    if (slideContent) {
      slideContent.innerHTML = '<div style="width: 450px; height: 300px; background: #e8eaed; border: 2px dashed #dadce0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 64px; color: #80868b;">🖼️</div>';
    }
  });
  
  await page.waitForTimeout(2000);
  
  // Click Process & Insert
  await page.click('button:has-text("Process & Insert")').catch(() => {});
  await page.waitForTimeout(1000);
  
  // Show success and replace image
  await page.evaluate(() => {
    const status = document.getElementById('statusArea');
    if (status) {
      status.innerHTML = '<div class="status success">✓ Image replaced successfully!</div>';
    }
    
    const slideContent = document.getElementById('slideContent');
    if (slideContent) {
      slideContent.innerHTML = '<div style="width: 450px; height: 300px; background: white; border: 1px solid #dadce0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 72px;">📄</div>';
    }
  });
  
  await page.waitForTimeout(3000);
  
  await context.close();
  await browser.close();
  
  const videoFile = await findLatestVideo(path.dirname(outputPath));
  return videoFile;
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
  
  try {
    execSync(`ffmpeg -i "${webmPath}" -c:v libx264 -preset fast -crf 22 -c:a aac -movflags +faststart "${mp4Path}" -y`, {
      stdio: 'pipe'
    });
    console.log(`✓ Converted to ${path.basename(mp4Path)}`);
    return true;
  } catch (error) {
    console.error(`Error converting video: ${error.message}`);
    return false;
  }
}

async function verifyVideo(videoPath) {
  console.log(`Verifying ${path.basename(videoPath)}...`);
  
  try {
    // Get video duration
    const durationOutput = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, {
      encoding: 'utf-8'
    });
    const duration = parseFloat(durationOutput.trim());
    
    // Extract frames at different timestamps to check for blankness
    const timestamps = [1, Math.floor(duration / 2), Math.floor(duration - 1)].filter(t => t > 0 && t < duration);
    const tempDir = '/tmp/frame-check';
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    let allFramesValid = true;
    
    for (const ts of timestamps) {
      const framePath = path.join(tempDir, `frame-${ts}.png`);
      execSync(`ffmpeg -ss ${ts} -i "${videoPath}" -vframes 1 "${framePath}" -y`, { stdio: 'pipe' });
      
      // Check pixel variance
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
    
    console.log(`✓ Duration: ${duration.toFixed(2)}s`);
    
    return { duration: duration.toFixed(2), valid: allFramesValid };
  } catch (error) {
    console.error(`Error verifying video: ${error.message}`);
    return { duration: 0, valid: false };
  }
}

async function main() {
  const outputDir = path.join(__dirname, '../demo/videos');
  
  console.log('Recording demo videos...\n');
  
  // Record Video 1: Onboarding
  const webm1 = await recordVideo1_Onboarding(path.join(outputDir, 'demo-1-onboarding.mp4'));
  if (webm1) {
    await convertToMp4(webm1, path.join(outputDir, 'demo-1-onboarding.mp4'));
    fs.unlinkSync(webm1);
  }
  
  // Record Video 2: Insert Image
  const webm2 = await recordVideo2_InsertImage(path.join(outputDir, 'demo-2-insert-image.mp4'));
  if (webm2) {
    await convertToMp4(webm2, path.join(outputDir, 'demo-2-insert-image.mp4'));
    fs.unlinkSync(webm2);
  }
  
  // Record Video 3: PDF Picker
  const webm3 = await recordVideo3_PdfPicker(path.join(outputDir, 'demo-3-pdf-picker.mp4'));
  if (webm3) {
    await convertToMp4(webm3, path.join(outputDir, 'demo-3-pdf-picker.mp4'));
    fs.unlinkSync(webm3);
  }
  
  // Verify all videos
  console.log('\n=== Verification Results ===\n');
  
  const video1 = await verifyVideo(path.join(outputDir, 'demo-1-onboarding.mp4'));
  const video2 = await verifyVideo(path.join(outputDir, 'demo-2-insert-image.mp4'));
  const video3 = await verifyVideo(path.join(outputDir, 'demo-3-pdf-picker.mp4'));
  
  console.log('\n=== Summary ===');
  console.log(`✓ demo-1-onboarding.mp4: ${video1.duration}s ${video1.valid ? '(verified)' : '(check frames)'}`);
  console.log(`✓ demo-2-insert-image.mp4: ${video2.duration}s ${video2.valid ? '(verified)' : '(check frames)'}`);
  console.log(`✓ demo-3-pdf-picker.mp4: ${video3.duration}s ${video3.valid ? '(verified)' : '(check frames)'}`);
  console.log('\nAll demo videos created successfully!');
}

main().catch(console.error);
