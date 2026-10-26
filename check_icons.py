#!/usr/bin/env python3
from PIL import Image
import numpy as np
import os

def check_image_variance(filepath):
    """Check if image has sufficient variance (not blank)"""
    img = Image.open(filepath)
    img_array = np.array(img)
    
    # Calculate variance
    variance = np.var(img_array)
    
    return variance

icons = [
    '/workspace/store-assets/icons/icon-32.png',
    '/workspace/store-assets/icons/icon-48.png',
    '/workspace/store-assets/icons/icon-96.png',
    '/workspace/store-assets/icons/icon-128.png',
    '/workspace/store-assets/icons/icon-1024.png'
]

print('Checking icon pixel variance...\n')
all_valid = True

for icon in icons:
    if os.path.exists(icon):
        variance = check_image_variance(icon)
        status = '✓ Valid' if variance > 100 else '✗ Too uniform/blank'
        print(f'{os.path.basename(icon)}: variance={variance:.2f} - {status}')
        if variance <= 100:
            all_valid = False
    else:
        print(f'{os.path.basename(icon)}: ✗ Not found')
        all_valid = False

print(f'\nOverall: {"All icons are valid!" if all_valid else "Some icons may be blank or invalid"}')
