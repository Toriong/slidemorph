import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

const COLORS = {
  blue: 'rgba(157,214,252,1)',
  purple: 'rgb(202,160,250)',
  gradientStart: 'rgba(209,127,247,1)',
  gradientEnd: 'rgba(157,214,252,1)',
};

function createGradient(ctx: any, width: number, height: number, angle = 135) {
  const angleRad = (angle * Math.PI) / 180;
  const x1 = width / 2 - Math.cos(angleRad) * width / 2;
  const y1 = height / 2 - Math.sin(angleRad) * height / 2;
  const x2 = width / 2 + Math.cos(angleRad) * width / 2;
  const y2 = height / 2 + Math.sin(angleRad) * height / 2;
  
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, COLORS.gradientStart);
  gradient.addColorStop(1, COLORS.gradientEnd);
  return gradient;
}

async function generateIcon(size: number, outputPath: string) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = createGradient(ctx, size, size);
  ctx.fillRect(0, 0, size, size);
  
  const fontSize = size * 0.5;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.fillText('📸', size / 2, size / 2);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${path.basename(outputPath)}`);
}

async function generateScreenshot(
  title: string,
  description: string,
  screenshotNum: number,
  outputPath: string
) {
  const width = 1280;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);
  
  const contentPadding = 40;
  const contentWidth = width - contentPadding * 2;
  const contentHeight = height - contentPadding * 2 - 100;
  
  const gradient = createGradient(ctx, contentWidth, 10);
  ctx.fillStyle = gradient;
  ctx.fillRect(contentPadding, contentPadding, contentWidth, 10);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(contentPadding, contentPadding + 10, contentWidth, contentHeight);
  
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.strokeRect(contentPadding, contentPadding + 10, contentWidth, contentHeight);
  
  const mockupHeight = contentHeight - 40;
  const sidebarWidth = 320;
  const slideWidth = contentWidth - sidebarWidth - 60;
  
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(contentPadding + 20, contentPadding + 30, slideWidth, mockupHeight);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(contentPadding + slideWidth + 40, contentPadding + 30, sidebarWidth, mockupHeight);
  
  ctx.strokeStyle = '#dadce0';
  ctx.lineWidth = 1;
  ctx.strokeRect(contentPadding + slideWidth + 40, contentPadding + 30, sidebarWidth, mockupHeight);
  
  const sidebarX = contentPadding + slideWidth + 40;
  const sidebarY = contentPadding + 30;
  
  const headerHeight = 80;
  const headerGradient = createGradient(ctx, sidebarWidth, headerHeight);
  ctx.fillStyle = headerGradient;
  ctx.fillRect(sidebarX, sidebarY, sidebarWidth, headerHeight);
  
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('📸 SlideMorph', sidebarX + sidebarWidth / 2, sidebarY + headerHeight / 2);
  
  let currentY = sidebarY + headerHeight + 30;
  
  if (screenshotNum === 1) {
    ctx.font = '18px Arial';
    ctx.fillStyle = '#202124';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to SlideMorph! 🎉', sidebarX + sidebarWidth / 2, currentY);
    currentY += 40;
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#5f6368';
    ctx.textAlign = 'left';
    const features = ['HEIC - iPhone photos', 'PDF pages', 'SVG vectors', 'WebP & AVIF'];
    features.forEach(feature => {
      ctx.fillText('• ' + feature, sidebarX + 20, currentY);
      currentY += 25;
    });
  } else if (screenshotNum === 2) {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(sidebarX + 20, currentY, sidebarWidth - 40, 120);
    ctx.strokeStyle = COLORS.blue;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(sidebarX + 20, currentY, sidebarWidth - 40, 120);
    ctx.setLineDash([]);
    
    ctx.font = '48px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.fillText('📁', sidebarX + sidebarWidth / 2, currentY + 60);
    
    currentY += 140;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#5f6368';
    ctx.fillText('Choose a file or drag & drop', sidebarX + sidebarWidth / 2, currentY);
  } else if (screenshotNum === 3) {
    ctx.font = '14px Arial';
    ctx.fillStyle = '#5f6368';
    ctx.textAlign = 'left';
    ctx.fillText('Selected: photo.heic', sidebarX + 20, currentY);
    currentY += 40;
    
    ctx.fillStyle = '#e6f4ea';
    ctx.fillRect(sidebarX + 20, currentY, sidebarWidth - 40, 40);
    ctx.font = '13px Arial';
    ctx.fillStyle = '#137333';
    ctx.fillText('✓ Image processed successfully', sidebarX + 30, currentY + 25);
  } else if (screenshotNum === 4) {
    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const pageX = sidebarX + 20 + col * 140;
      const pageY = currentY + row * 120;
      
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(pageX, pageY, 130, 100);
      ctx.strokeStyle = col === 0 && row === 0 ? COLORS.purple : '#dadce0';
      ctx.lineWidth = col === 0 && row === 0 ? 3 : 1;
      ctx.strokeRect(pageX, pageY, 130, 100);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#202124';
      ctx.textAlign = 'center';
      ctx.fillText(`Page ${i + 1}`, pageX + 65, pageY + 115);
    }
  }
  
  const captionY = height - 60;
  ctx.fillStyle = '#202124';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, captionY);
  
  ctx.fillStyle = '#5f6368';
  ctx.font = '16px Arial';
  ctx.fillText(description, width / 2, captionY + 25);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${path.basename(outputPath)}`);
}

async function generateBanner(width: number, height: number, outputPath: string) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = createGradient(ctx, width, height);
  ctx.fillRect(0, 0, width, height);
  
  const iconSize = height * 0.4;
  ctx.font = `bold ${iconSize}px Arial`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.fillText('📸', 10, height / 2);
  
  const textX = iconSize + 20;
  ctx.font = `bold ${height * 0.15}px Arial`;
  ctx.fillText('SlideMorph', textX, height * 0.4);
  
  ctx.font = `${height * 0.08}px Arial`;
  ctx.fillText('Insert HEIC, PDF, SVG, WebP & AVIF', textX, height * 0.65);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${path.basename(outputPath)}`);
}

async function main() {
  const assetsDir = path.join(process.cwd(), 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  console.log('Generating visual assets...\n');
  
  await generateIcon(128, path.join(assetsDir, 'icon-128.png'));
  await generateIcon(32, path.join(assetsDir, 'icon-32.png'));
  
  const screenshots = [
    { title: 'Welcome & Onboarding', description: 'Get started with SlideMorph in seconds' },
    { title: 'Easy File Selection', description: 'Drag & drop or choose files to convert' },
    { title: 'Process & Insert', description: 'Convert images instantly in your browser' },
    { title: 'PDF Page Picker', description: 'Select any page from your PDF documents' },
  ];
  
  for (let i = 0; i < screenshots.length; i++) {
    await generateScreenshot(
      screenshots[i].title,
      screenshots[i].description,
      i + 1,
      path.join(assetsDir, `screenshot-${i + 1}.png`)
    );
  }
  
  await generateBanner(220, 140, path.join(assetsDir, 'banner-220x140.png'));
  await generateBanner(440, 280, path.join(assetsDir, 'card-banner.png'));
  
  console.log('\n✓ All visual assets generated successfully!');
}

main().catch(console.error);
