#!/usr/bin/env python3
from PIL import Image
import os

# Resize icon to multiple sizes
source = '/workspace/store-assets/icons/icon-1024.png'
sizes = [128, 96, 48, 32]

img = Image.open(source)

for size in sizes:
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    output = f'/workspace/store-assets/icons/icon-{size}.png'
    resized.save(output, 'PNG')
    print(f'Created {output}')

print('All icons created successfully!')
