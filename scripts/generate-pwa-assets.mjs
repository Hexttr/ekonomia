/**
 * Бренд-ассеты из public/brand/figa-source.png
 * npm run pwa:assets
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "public", "brand", "figa-source.png");
const iconsDir = join(root, "public", "icons");
const publicDir = join(root, "public");

const BRAND = {
  bg: "#0f1114",
  green: "#10b981",
  greenDark: "#059669",
  red: "#ef4444",
};

function roundedIconBg(size, radius = 112) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BRAND.green}"/>
      <stop offset="100%" stop-color="${BRAND.greenDark}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#g)"/>
</svg>`);
}

function splashSvg() {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1170" height="2532" viewBox="0 0 1170 2532">
  <rect width="1170" height="2532" fill="${BRAND.bg}"/>
  <defs>
    <radialGradient id="glow" cx="50%" cy="32%" r="42%">
      <stop offset="0%" stop-color="${BRAND.green}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${BRAND.bg}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1170" height="2532" fill="url(#glow)"/>
  <text x="585" y="1520" text-anchor="middle" font-family="system-ui,sans-serif" font-size="72" font-weight="800" fill="#fff">
    <tspan fill="${BRAND.red}">Е</tspan>кономия
  </text>
  <text x="585" y="1595" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" fill="#9ca3af">хватит тратить бабки</text>
</svg>`);
}

async function trimHand(sharp, input) {
  return sharp(input)
    .trim({ threshold: 24, background: "#f5f5f0" })
    .png()
    .toBuffer();
}

async function buildMark(sharp, handTrimmed, size, handScale = 0.72) {
  const bg = await sharp(roundedIconBg(size, Math.round(size * 0.22)))
    .resize(size, size)
    .png()
    .toBuffer();

  const handSize = Math.round(size * handScale);
  const hand = await sharp(handTrimmed)
    .resize(handSize, handSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp(bg).composite([{ input: hand, gravity: "center" }]).png().toBuffer();
}

async function main() {
  const sharp = (await import("sharp")).default;
  await mkdir(iconsDir, { recursive: true });

  const handTrimmed = await trimHand(sharp, source);

  const mark512 = await buildMark(sharp, handTrimmed, 512);
  const mark192 = await sharp(mark512).resize(192, 192).png().toBuffer();

  await sharp(mark512).toFile(join(publicDir, "logo-mark.png"));
  await sharp(mark192).toFile(join(iconsDir, "icon-192.png"));
  await sharp(mark512).toFile(join(iconsDir, "icon-512.png"));
  await sharp(mark512).resize(180, 180).png().toFile(join(publicDir, "icon.png"));
  await sharp(mark512).resize(32, 32).png().toFile(join(publicDir, "favicon.png"));

  const splashIcon = await buildMark(sharp, handTrimmed, 320, 0.68);
  const splashBase = await sharp(splashSvg()).png().toBuffer();
  const splashHandY = Math.round(2532 * 0.36 - 160);

  await sharp(splashBase)
    .composite([
      {
        input: splashIcon,
        left: Math.round((1170 - 320) / 2),
        top: splashHandY,
      },
    ])
    .png()
    .toFile(join(publicDir, "splash.png"));

  console.log("Brand assets generated from public/brand/figa-source.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
