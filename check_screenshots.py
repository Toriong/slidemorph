#!/usr/bin/env python3
from PIL import Image
import numpy as np
import os

def check_image_variance(filepath):
    """Check if image has sufficient variance (not blank)"""
    img = Image.open(filepath)
    img_array = np.array(img)
    variance = np.var(img_array)
    return variance

screenshots = [
    '/workspace/store-assets/screenshots/screenshot-1-welcome.jpg',
    '/workspace/store-assets/screenshots/screenshot-2-file-select.jpg',
    '/workspace/store-assets/screenshots/screenshot-3-pdf-pages.jpg',
    '/workspace/store-assets/screenshots/screenshot-4-success.jpg',
    '/workspace/store-assets/card-banner.png'
]

print('Checking screenshot and banner pixel variance...\n')
all_valid = True

for screenshot in screenshots:
    if os.path.exists(screenshot):
        variance = check_image_variance(screenshot)
        status = '✓ Valid' if variance > 100 else '✗ Too uniform/blank'
        print(f'{os.path.basename(screenshot)}: variance={variance:.2f} - {status}')
        if variance <= 100:
            all_valid = False
    else:
        print(f'{os.path.basename(screenshot)}: ✗ Not found')
        all_valid = False

print(f'\nOverall: {"All assets are valid!" if all_valid else "Some assets may be blank or invalid"}')
