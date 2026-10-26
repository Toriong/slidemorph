#!/usr/bin/env python3
"""
Generate demo videos for SlideMorph showing the conversion and insertion workflow
"""
from PIL import Image, ImageDraw, ImageFont
import os
import subprocess

# Video parameters
WIDTH = 1280
HEIGHT = 720
FPS = 30

def create_gradient_background(width, height):
    """Create purple-blue gradient background"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        ratio = y / height
        r = int(209 + (157 - 209) * ratio)
        g = int(127 + (214 - 127) * ratio)
        b = int(247 + (252 - 247) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def add_text(img, text, pos, size=40, color=(255, 255, 255)):
    """Add text to image"""
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except:
        font = ImageFont.load_default()
    draw.text(pos, text, font=font, fill=color)
    return img

def add_rounded_rect(draw, xy, radius=20, fill=(255, 255, 255)):
    """Draw a rounded rectangle"""
    x1, y1, x2, y2 = xy
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
    draw.ellipse([x1, y1, x1 + radius*2, y1 + radius*2], fill=fill)
    draw.ellipse([x2 - radius*2, y1, x2, y1 + radius*2], fill=fill)
    draw.ellipse([x1, y2 - radius*2, x1 + radius*2, y2], fill=fill)
    draw.ellipse([x2 - radius*2, y2 - radius*2, x2, y2], fill=fill)

def create_video_1():
    """Video 1: HEIC Conversion and Insert (20 seconds)"""
    print("Creating Video 1: HEIC Conversion and Insert...")
    
    frames_dir = "/tmp/video1_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    total_frames = FPS * 20  # 20 seconds
    
    for frame_num in range(total_frames):
        img = create_gradient_background(WIDTH, HEIGHT)
        draw = ImageDraw.Draw(img)
        
        # Draw sidebar
        add_rounded_rect(draw, [50, 50, 450, HEIGHT-50], fill=(255, 255, 255))
        
        # Title
        img = add_text(img, "SlideMorph", (80, 80), size=36, color=(120, 60, 180))
        img = add_text(img, "Convert & Insert Images", (80, 130), size=18, color=(100, 100, 100))
        
        # Draw Google Slides mockup
        add_rounded_rect(draw, [500, 50, WIDTH-50, HEIGHT-50], fill=(245, 245, 245))
        img = add_text(img, "Google Slides", (550, 70), size=24, color=(60, 60, 60))
        
        # Animation stages based on frame number
        progress = frame_num / total_frames
        
        if progress < 0.2:
            # Stage 1: File selection
            img = add_text(img, "1. Select HEIC file", (80, 200), size=22, color=(80, 80, 80))
            add_rounded_rect(draw, [80, 250, 420, 380], radius=10, fill=(240, 245, 255))
            img = add_text(img, "Choose HEIC Photo", (150, 300), size=20, color=(120, 120, 120))
            
        elif progress < 0.5:
            # Stage 2: Converting
            img = add_text(img, "2. Converting to PNG", (80, 200), size=22, color=(80, 80, 80))
            add_rounded_rect(draw, [80, 250, 420, 380], radius=10, fill=(240, 255, 240))
            img = add_text(img, "Converting...", (180, 280), size=20, color=(40, 150, 40))
            # Progress bar
            progress_inner = (progress - 0.2) / 0.3
            draw.rectangle([100, 320, 400, 340], fill=(220, 220, 220))
            draw.rectangle([100, 320, 100 + int(300 * progress_inner), 340], fill=(157, 214, 252))
            
        elif progress < 0.7:
            # Stage 3: Preview
            img = add_text(img, "3. Preview ready", (80, 200), size=22, color=(80, 80, 80))
            add_rounded_rect(draw, [80, 250, 420, 450], radius=10, fill=(200, 200, 255))
            img = add_text(img, "[Image Preview]", (180, 330), size=18, color=(100, 100, 100))
            
        else:
            # Stage 4: Insert
            img = add_text(img, "4. Inserted!", (80, 200), size=22, color=(40, 150, 40))
            # Show image on slide
            add_rounded_rect(draw, [600, 200, 900, 500], radius=10, fill=(100, 150, 255))
            img = add_text(img, "✓ Success", (700, 350), size=24, color=(255, 255, 255))
        
        # Save frame
        img.save(f"{frames_dir}/frame_{frame_num:04d}.png")
    
    # Create video from frames
    output_path = "/workspace/demo/videos/demo-1-heic-conversion.mp4"
    cmd = [
        'ffmpeg', '-y', '-framerate', str(FPS),
        '-i', f'{frames_dir}/frame_%04d.png',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-preset', 'medium', '-crf', '23',
        output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    
    # Clean up frames
    subprocess.run(['rm', '-rf', frames_dir], check=True)
    
    # Get duration
    duration = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', 
         '-of', 'default=noprint_wrappers=1:nokey=1', output_path],
        capture_output=True, text=True
    )
    return float(duration.stdout.strip())

def create_video_2():
    """Video 2: PDF Page Selection (15 seconds)"""
    print("Creating Video 2: PDF Page Selection...")
    
    frames_dir = "/tmp/video2_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    total_frames = FPS * 15  # 15 seconds
    
    for frame_num in range(total_frames):
        img = create_gradient_background(WIDTH, HEIGHT)
        draw = ImageDraw.Draw(img)
        
        # Draw sidebar
        add_rounded_rect(draw, [50, 50, 450, HEIGHT-50], fill=(255, 255, 255))
        
        # Title
        img = add_text(img, "SlideMorph", (80, 80), size=36, color=(120, 60, 180))
        img = add_text(img, "PDF Page Selection", (80, 130), size=18, color=(100, 100, 100))
        
        # Draw Google Slides mockup
        add_rounded_rect(draw, [500, 50, WIDTH-50, HEIGHT-50], fill=(245, 245, 245))
        
        # Animation stages
        progress = frame_num / total_frames
        
        if progress < 0.3:
            # Stage 1: PDF selected
            img = add_text(img, "PDF: Report.pdf", (80, 200), size=20, color=(80, 80, 80))
            add_rounded_rect(draw, [80, 240, 420, 400], radius=10, fill=(255, 240, 240))
            img = add_text(img, "Select Page", (190, 250), size=18, color=(100, 100, 100))
            
            # Page selector
            page_num = 1
            img = add_text(img, f"Page: {page_num} of 12", (150, 300), size=22, color=(80, 80, 80))
            
        elif progress < 0.7:
            # Stage 2: Page navigation
            page_num = min(5, int(1 + (progress - 0.3) / 0.4 * 4))
            img = add_text(img, "PDF: Report.pdf", (80, 200), size=20, color=(80, 80, 80))
            img = add_text(img, f"Page: {page_num} of 12", (150, 250), size=22, color=(80, 80, 80))
            
            add_rounded_rect(draw, [80, 300, 420, 500], radius=10, fill=(240, 240, 240))
            img = add_text(img, f"Page {page_num} Preview", (160, 380), size=18, color=(100, 100, 100))
            
        else:
            # Stage 3: Insert selected page
            img = add_text(img, "Page 5 inserted!", (80, 200), size=22, color=(40, 150, 40))
            # Show page on slide
            add_rounded_rect(draw, [600, 150, 950, 550], radius=10, fill=(255, 255, 255))
            img = add_text(img, "Page 5", (750, 340), size=24, color=(80, 80, 80))
        
        img.save(f"{frames_dir}/frame_{frame_num:04d}.png")
    
    # Create video
    output_path = "/workspace/demo/videos/demo-2-pdf-pages.mp4"
    cmd = [
        'ffmpeg', '-y', '-framerate', str(FPS),
        '-i', f'{frames_dir}/frame_%04d.png',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-preset', 'medium', '-crf', '23',
        output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    subprocess.run(['rm', '-rf', frames_dir], check=True)
    
    duration = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
         '-of', 'default=noprint_wrappers=1:nokey=1', output_path],
        capture_output=True, text=True
    )
    return float(duration.stdout.strip())

def create_video_3():
    """Video 3: Multiple Format Support (18 seconds)"""
    print("Creating Video 3: Multiple Format Support...")
    
    frames_dir = "/tmp/video3_frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    total_frames = FPS * 18  # 18 seconds
    formats = ["SVG", "WebP", "AVIF"]
    
    for frame_num in range(total_frames):
        img = create_gradient_background(WIDTH, HEIGHT)
        draw = ImageDraw.Draw(img)
        
        # Draw sidebar
        add_rounded_rect(draw, [50, 50, 450, HEIGHT-50], fill=(255, 255, 255))
        
        # Title
        img = add_text(img, "SlideMorph", (80, 80), size=36, color=(120, 60, 180))
        img = add_text(img, "Multiple Formats", (80, 130), size=18, color=(100, 100, 100))
        
        # Draw Google Slides mockup
        add_rounded_rect(draw, [500, 50, WIDTH-50, HEIGHT-50], fill=(245, 245, 245))
        
        # Cycle through formats
        progress = frame_num / total_frames
        format_idx = int(progress * 3) % 3
        current_format = formats[format_idx]
        
        img = add_text(img, f"Format: {current_format}", (80, 200), size=22, color=(80, 80, 80))
        
        # Show conversion
        add_rounded_rect(draw, [80, 250, 420, 420], radius=10, fill=(245, 240, 255))
        img = add_text(img, f"{current_format} → PNG", (150, 310), size=24, color=(120, 60, 180))
        
        # Show result on slide
        add_rounded_rect(draw, [550, 150, 850, 450], radius=10, fill=(220, 230, 255))
        img = add_text(img, f"Converted", (640, 280), size=20, color=(80, 80, 80))
        img = add_text(img, f"{current_format}", (660, 320), size=18, color=(100, 100, 100))
        
        img.save(f"{frames_dir}/frame_{frame_num:04d}.png")
    
    # Create video
    output_path = "/workspace/demo/videos/demo-3-multiple-formats.mp4"
    cmd = [
        'ffmpeg', '-y', '-framerate', str(FPS),
        '-i', f'{frames_dir}/frame_%04d.png',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-preset', 'medium', '-crf', '23',
        output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    subprocess.run(['rm', '-rf', frames_dir], check=True)
    
    duration = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
         '-of', 'default=noprint_wrappers=1:nokey=1', output_path],
        capture_output=True, text=True
    )
    return float(duration.stdout.strip())

if __name__ == "__main__":
    print("Generating demo videos...\n")
    
    duration1 = create_video_1()
    print(f"✓ Video 1 created: {duration1:.1f} seconds\n")
    
    duration2 = create_video_2()
    print(f"✓ Video 2 created: {duration2:.1f} seconds\n")
    
    duration3 = create_video_3()
    print(f"✓ Video 3 created: {duration3:.1f} seconds\n")
    
    print(f"All demo videos created successfully!")
    print(f"Total duration: {duration1 + duration2 + duration3:.1f} seconds")
