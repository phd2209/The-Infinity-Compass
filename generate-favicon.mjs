import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

const sizes = [16, 32, 48, 64, 128, 256];

async function generateFavicons() {
  console.log('Generating favicons from logo_transp.png...');

  // Read the transparent logo
  const input = 'public/logo_transp.png';

  // Generate PNG favicons at different sizes
  for (const size of sizes) {
    await sharp(input)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(`public/favicon-${size}x${size}.png`);
    console.log(`✓ Generated favicon-${size}x${size}.png`);
  }

  // Generate the main favicon.ico (32x32)
  await sharp(input)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile('public/favicon.ico');
  console.log('✓ Generated favicon.ico');

  // Generate apple-touch-icon
  await sharp(input)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('✓ Generated apple-touch-icon.png');

  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);
