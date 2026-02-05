const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Generate OG image
sharp(path.join(publicDir, 'og-image.svg'))
  .resize(1200, 630)
  .png()
  .toFile(path.join(publicDir, 'og-image.png'))
  .then(() => console.log('✅ og-image.png created'))
  .catch(err => console.error('❌ OG image error:', err));

// Generate favicon PNG (32x32)
sharp(path.join(publicDir, 'favicon.svg'))
  .resize(32, 32)
  .png()
  .toFile(path.join(publicDir, 'favicon-32x32.png'))
  .then(() => console.log('✅ favicon-32x32.png created'))
  .catch(err => console.error('❌ Favicon 32 error:', err));

// Generate favicon PNG (16x16)
sharp(path.join(publicDir, 'favicon.svg'))
  .resize(16, 16)
  .png()
  .toFile(path.join(publicDir, 'favicon-16x16.png'))
  .then(() => console.log('✅ favicon-16x16.png created'))
  .catch(err => console.error('❌ Favicon 16 error:', err));

// Generate apple touch icon (180x180)
sharp(path.join(publicDir, 'favicon.svg'))
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'))
  .then(() => console.log('✅ apple-touch-icon.png created'))
  .catch(err => console.error('❌ Apple icon error:', err));
