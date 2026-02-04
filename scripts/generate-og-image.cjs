const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'og-image.svg');
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');

// Read SVG and convert to PNG
sharp(svgPath)
  .resize(1200, 630)
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log('✅ OG image created successfully at:', outputPath);
  })
  .catch(err => {
    console.error('❌ Error creating OG image:', err);
  });
