/* eslint-disable @typescript-eslint/no-unused-vars */
import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function createMockSlidesEditor(page: Page) {
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Roboto', Arial, sans-serif;
          background: #f8f9fa;
          display: flex;
          height: 100vh;
        }
        .slides-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .toolbar {
          height: 60px;
          background: #fff;
          border-bottom: 1px solid #dadce0;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }
        .toolbar-title {
          font-size: 18px;
          font-weight: 500;
          color: #202124;
        }
        .slides-main {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .slide-thumbnails {
          width: 160px;
          background: #fff;
          border-right: 1px solid #dadce0;
          padding: 16px 8px;
        }
        .slide-thumb {
          width: 140px;
          height: 80px;
          background: #f8f9fa;
          border: 2px solid #dadce0;
          border-radius: 4px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }
        .slide-thumb.active {
          border-color: #1a73e8;
        }
        .slide-canvas {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        .slide {
          width: 800px;
          height: 450px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          position: relative;
        }
        .slide.with-image {
          background: white;
        }
        .slide-image {
          width: 400px;
          height: 300px;
          background: linear-gradient(135deg, rgba(209,127,247,0.2) 0%, rgba(157,214,252,0.2) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
        }
      </style>
    </head>
    <body>
      <div class="slides-container">
        <div class="toolbar">
          <div class="toolbar-title">🎨 Untitled presentation - Google Slides</div>
        </div>
        <div class="slides-main">
          <div class="slide-thumbnails">
            <div class="slide-thumb active">1</div>
            <div class="slide-thumb">2</div>
            <div class="slide-thumb">3</div>
          </div>
          <div class="slide-canvas">
            <div class="slide" id="mainSlide">
              <span id="slideContent">📊</span>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
}

async function addSidebarToPage(page: Page, sidebarHtml: string) {
  await page.evaluate((html) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    const sidebar = doc.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.style.cssText = `
      width: 320px;
      height: 100vh;
      border-left: 1px solid #dadce0;
      background: white;
      overflow-y: auto;
    `;
    sidebar.innerHTML = html;
    doc.body.appendChild(sidebar);
  }, sidebarHtml);
}

async function generateOnboardingVideo(browser: Browser, _sidebarHtml: string) {
  const context = await browser.newContext({
    recordVideo: {
      dir: 'assets',
      size: { width: 1600, height: 900 }
    },
    viewport: { width: 1600, height: 900 }
  });
  
  const page = await context.newPage();
  await createMockSlidesEditor(page);
  
  const onboardingHtml = `
    <div style="padding: 24px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="padding: 20px; background: linear-gradient(135deg, rgba(209,127,247,1) 0%, rgba(157,214,252,1) 100%); color: white; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">📸 SlideMorph</h1>
        <p style="font-size: 13px;">Insert HEIC, PDF, SVG, WebP & AVIF images</p>
      </div>
      <h2 style="font-size: 20px; margin: 24px 0 16px; color: #202124;">Welcome to SlideMorph! 🎉</h2>
      <p style="color: #5f6368; margin-bottom: 12px;">Insert images in formats Google Slides doesn't natively support:</p>
      <ul style="text-align: left; margin: 16px 0; padding-left: 24px;">
        <li style="margin-bottom: 8px; color: #5f6368;"><strong>HEIC</strong> - iPhone photos</li>
        <li style="margin-bottom: 8px; color: #5f6368;"><strong>PDF pages</strong> - Select any page from a PDF</li>
        <li style="margin-bottom: 8px; color: #5f6368;"><strong>SVG</strong> - Scalable vector graphics</li>
        <li style="margin-bottom: 8px; color: #5f6368;"><strong>WebP & AVIF</strong> - Modern web formats</li>
      </ul>
      <p style="font-size: 12px; color: #5f6368; margin: 16px 0;">All conversion happens locally in your browser. No files are uploaded to any server.</p>
      
      <div style="padding: 16px; margin: 16px 0; background: linear-gradient(135deg, rgba(209,127,247,0.1) 0%, rgba(157,214,252,0.1) 100%); border: 1px solid rgba(157,214,252,0.3); border-radius: 8px;">
        <h3 style="font-size: 16px; margin-bottom: 8px; color: #202124;">🚀 Powered by Drive I/O</h3>
        <p style="font-size: 13px; color: #5f6368; margin-bottom: 12px;">Check out more powerful Google Drive and Workspace tools</p>
        <a href="#" style="display: inline-block; padding: 10px 24px; background: white; color: #1a73e8; border: 1px solid #dadce0; border-radius: 4px; text-decoration: none; font-weight: 500;">Visit Drive I/O</a>
      </div>
      
      <button style="padding: 10px 24px; background: linear-gradient(135deg, rgba(209,127,247,1) 0%, rgba(157,214,252,1) 100%); color: white; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; margin-top: 16px;">Get Started</button>
    </div>
  `;
  
  await addSidebarToPage(page, onboardingHtml);
  await page.waitForTimeout(3000);
  
  await page.click('button');
  await page.waitForTimeout(1000);
  
  await context.close();
  return 'onboarding';
}

async function generateInsertImageVideo(browser: Browser) {
  const context = await browser.newContext({
    recordVideo: {
      dir: 'assets',
      size: { width: 1600, height: 900 }
    },
    viewport: { width: 1600, height: 900 }
  });
  
  const page = await context.newPage();
  await createMockSlidesEditor(page);
  
  const mainHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="padding: 20px; background: linear-gradient(135deg, rgba(209,127,247,1) 0%, rgba(157,214,252,1) 100%); color: white; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">📸 SlideMorph</h1>
        <p style="font-size: 13px;">Insert HEIC, PDF, SVG, WebP & AVIF images</p>
      </div>
      <div style="padding: 16px;">
        <div style="font-size: 13px; font-weight: 500; color: #5f6368; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Select File</div>
        <div id="dropZone" style="padding: 40px 20px; border: 2px dashed rgba(157,214,252,1); border-radius: 8px; text-align: center; cursor: pointer; background: #f8f9fa;">
          <div style="font-size: 48px; margin-bottom: 12px;">📁</div>
          <div><strong>Choose a file</strong> or drag & drop</div>
          <div style="font-size: 12px; color: #5f6368; margin-top: 8px;">HEIC, PDF, SVG, WebP, AVIF</div>
        </div>
        <div id="status" style="display: none; padding: 12px; border-radius: 4px; margin: 16px 0; font-size: 13px;"></div>
        <div id="actions" style="display: none; margin-top: 16px;">
          <div style="font-size: 13px; font-weight: 500; color: #5f6368; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Action</div>
          <label style="display: block; padding: 12px; margin-bottom: 8px; border: 1px solid #dadce0; border-radius: 4px; cursor: pointer;">
            <input type="radio" name="action" checked> Insert on current slide
          </label>
          <button id="processBtn" style="width: 100%; padding: 10px 24px; background: linear-gradient(135deg, rgba(209,127,247,1) 0%, rgba(157,214,252,1) 100%); color: white; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Process & Insert</button>
        </div>
      </div>
    </div>
  `;
  
  await addSidebarToPage(page, mainHtml);
  await page.waitForTimeout(1500);
  
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    const dropZone = doc.getElementById('dropZone');
    if (dropZone) {
      dropZone.style.borderColor = 'rgba(209,127,247,1)';
      dropZone.style.background = 'rgba(157,214,252,0.1)';
      dropZone.innerHTML = '<div style="font-size: 48px; margin-bottom: 12px;">✓</div><div>photo.heic selected</div>';
    }
    const status = doc.getElementById('status');
    if (status) {
      status.style.display = 'block';
      status.style.background = 'rgba(157,214,252,0.1)';
      status.style.color = '#1967d2';
      status.style.border = '1px solid rgba(157,214,252,0.3)';
      status.textContent = 'Selected: photo.heic';
    }
    const actions = doc.getElementById('actions');
    if (actions) actions.style.display = 'block';
  });
  
  await page.waitForTimeout(2000);
  
  await page.click('#processBtn');
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    const status = doc.getElementById('status');
    if (status) {
      status.style.background = '#e6f4ea';
      status.style.color = '#137333';
      status.style.border = '1px solid #c6e1c6';
      status.textContent = '✓ Image processed successfully!';
    }
  });
  
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    const slide = doc.getElementById('mainSlide');
    if (slide) {
      slide.classList.add('with-image');
      slide.innerHTML = '<div class="slide-image">📸</div>';
    }
  });
  
  await page.waitForTimeout(2000);
  
  await context.close();
  return 'insert-image';
}

async function generatePdfPickerVideo(browser: Browser) {
  const context = await browser.newContext({
    recordVideo: {
      dir: 'assets',
      size: { width: 1600, height: 900 }
    },
    viewport: { width: 1600, height: 900 }
  });
  
  const page = await context.newPage();
  await createMockSlidesEditor(page);
  
  const pdfHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="padding: 20px; background: linear-gradient(135deg, rgba(209,127,247,1) 0%, rgba(157,214,252,1) 100%); color: white; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">📸 SlideMorph</h1>
        <p style="font-size: 13px;">Insert HEIC, PDF, SVG, WebP & AVIF images</p>
      </div>
      <div style="padding: 16px;">
        <div style="padding: 12px; border-radius: 4px; margin-bottom: 16px; font-size: 13px; background: rgba(157,214,252,0.1); color: #1967d2; border: 1px solid rgba(157,214,252,0.3);">
          Selected: document.pdf
        </div>
        <div style="font-size: 13px; font-weight: 500; color: #5f6368; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Select PDF Page</div>
        <div id="pdfPages" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 8px; border: 1px solid #dadce0; border-radius: 4px; max-height: 300px; overflow-y: auto;">
          <div class="pdf-page" style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
            <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
            <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 1</div>
          </div>
          <div class="pdf-page" style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
            <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
            <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 2</div>
          </div>
          <div class="pdf-page" style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
            <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
            <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 3</div>
          </div>
          <div class="pdf-page" style="cursor: pointer; border: 2px solid transparent; border-radius: 4px; overflow: hidden;">
            <div style="width: 100%; height: 100px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 32px;">📄</div>
            <div style="text-align: center; padding: 4px; font-size: 12px; background: #f8f9fa;">Page 4</div>
          </div>
        </div>
        <div style="margin-top: 16px;">
          <button style="width: 100%; padding: 10px 24px; background: linear-gradient(135deg, rgba(209,127,247,1) 0%, rgba(157,214,252,1) 100%); color: white; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Process & Insert</button>
        </div>
      </div>
    </div>
  `;
  
  await addSidebarToPage(page, pdfHtml);
  await page.waitForTimeout(1500);
  
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    const pages = doc.querySelectorAll('.pdf-page');
    if (pages[1]) {
      (pages[1] as any).style.borderColor = 'rgba(209,127,247,1)';
    }
  });
  
  await page.waitForTimeout(2000);
  
  await page.click('button');
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;
    const slide = doc.getElementById('mainSlide');
    if (slide) {
      slide.classList.add('with-image');
      slide.innerHTML = '<div class="slide-image">📄</div>';
    }
  });
  
  await page.waitForTimeout(2000);
  
  await context.close();
  return 'pdf-picker';
}

async function main() {
  console.log('Generating demo videos...\n');
  
  const browser = await chromium.launch();
  
  const sidebarPath = path.join(process.cwd(), 'src', 'Sidebar.html');
  const sidebarHtml = fs.readFileSync(sidebarPath, 'utf-8');
  
  console.log('Recording onboarding demo...');
  const video1 = await generateOnboardingVideo(browser, sidebarHtml);
  console.log(`✓ Recorded ${video1} video`);
  
  console.log('Recording image insert demo...');
  const video2 = await generateInsertImageVideo(browser);
  console.log(`✓ Recorded ${video2} video`);
  
  console.log('Recording PDF picker demo...');
  const video3 = await generatePdfPickerVideo(browser);
  console.log(`✓ Recorded ${video3} video`);
  
  await browser.close();
  
  console.log('\n⏳ Waiting for video files to be written...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const assetsDir = path.join(process.cwd(), 'assets');
  const videoFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.webm'));
  
  if (videoFiles.length >= 3) {
    videoFiles.sort();
    fs.renameSync(
      path.join(assetsDir, videoFiles[0]),
      path.join(assetsDir, 'demo-1-onboarding.webm')
    );
    fs.renameSync(
      path.join(assetsDir, videoFiles[1]),
      path.join(assetsDir, 'demo-2-insert-image.webm')
    );
    fs.renameSync(
      path.join(assetsDir, videoFiles[2]),
      path.join(assetsDir, 'demo-3-pdf-picker.webm')
    );
    
    console.log('\n✓ Generated 3 demo videos:');
    console.log('  - demo-1-onboarding.webm');
    console.log('  - demo-2-insert-image.webm');
    console.log('  - demo-3-pdf-picker.webm');
    
    for (const name of ['demo-1-onboarding.webm', 'demo-2-insert-image.webm', 'demo-3-pdf-picker.webm']) {
      const stats = fs.statSync(path.join(assetsDir, name));
      console.log(`    ${name}: ${(stats.size / 1024).toFixed(1)} KB`);
    }
  }
  
  console.log('\n✓ All demo videos generated successfully!');
}

main().catch(console.error);
