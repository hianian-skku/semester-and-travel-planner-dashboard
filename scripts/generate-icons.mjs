import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// 1. Sleek, modern flight / airplane SVG icon
// - Deep sky blue to rich royal indigo vibrant gradient
// - Clean aerodynamic commercial passenger jet taking off towards top-right
// - Subtle flight contrail curve
// - Crisp, high visibility at both 16x16, 32x32 favicon sizes and 180x180 app touch icons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <!-- Premium Sky Gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="45%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>

    <!-- Subtle Inner Highlight -->
    <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>

    <!-- Soft Drop Shadow for Airplane -->
    <filter id="planeShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0c2340" flood-opacity="0.3" />
    </filter>

    <!-- Flight contrail dash gradient -->
    <linearGradient id="trailGrad" x1="0%" y1="100%" x2="80%" y2="20%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.75" />
    </linearGradient>
  </defs>

  <!-- Squircle App / Favicon Background -->
  <rect width="180" height="180" rx="40" fill="url(#skyGrad)" />
  <rect width="180" height="180" rx="40" fill="url(#innerGlow)" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.2" />

  <!-- Dynamic Curved Flight Trail Line -->
  <path d="M 28 152 Q 62 136 86 104" fill="none" stroke="url(#trailGrad)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="6 6" />

  <!-- Modern Airplane Silhouette (Oriented ~45° Up-Right) -->
  <g filter="url(#planeShadow)" transform="translate(93, 87) rotate(-45) translate(-90, -90)">
    <!-- Aerodynamic Jet -->
    <path fill="#ffffff" d="
      M 90,20
      C 93.5,20 96.5,26 96.5,38
      L 96.5,76
      L 162,100
      L 162,112
      L 96.5,95
      L 96.5,135
      L 116,149
      L 116,158
      L 90,152
      L 64,158
      L 64,149
      L 83.5,135
      L 83.5,95
      L 18,112
      L 18,100
      L 83.5,76
      L 83.5,38
      C 83.5,26 86.5,20 90,20
      Z
    " />
  </g>
</svg>`

async function main() {
  const publicDir = path.resolve('public')
  
  // 1. Write icon.svg
  const svgPath = path.join(publicDir, 'icon.svg')
  fs.writeFileSync(svgPath, svgContent, 'utf-8')
  console.log('✓ Created public/icon.svg')

  // 2. Generate PNGs with sharp
  const buffer = Buffer.from(svgContent)

  // 32x32 for icon-light and icon-dark
  await sharp(buffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'icon-light-32x32.png'))
  console.log('✓ Created public/icon-light-32x32.png')

  await sharp(buffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'icon-dark-32x32.png'))
  console.log('✓ Created public/icon-dark-32x32.png')

  // 180x180 for apple-icon.png
  await sharp(buffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-icon.png'))
  console.log('✓ Created public/apple-icon.png')

  // Also create favicon.ico / favicon.png if needed
  await sharp(buffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'))
  console.log('✓ Created public/favicon.png')

  // Also place in app/ for direct Next.js app router recognition
  const appDir = path.resolve('app')
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent, 'utf-8')
  console.log('✓ Created app/icon.svg')
}

main().catch(console.error)
