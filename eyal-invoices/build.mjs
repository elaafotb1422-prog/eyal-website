// Builds a single self-contained HTML file (fonts + QR library inlined) that works fully offline.
// Usage: node build.mjs   →   Eyal-Invoices.html
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const v = f => join(dir, 'vendor', f);

const AR = 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
const LA = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const fonts = [];
for (const w of [400, 500, 700, 900]) {
  for (const [sub, range] of [['arabic', AR], ['latin', LA]]) {
    const b64 = readFileSync(v(`tajawal-${sub}-${w}-normal.woff2`)).toString('base64');
    fonts.push(`@font-face{font-family:'Tajawal';font-style:normal;font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');unicode-range:${range}}`);
  }
}

const qr = readFileSync(v('qrcode.js'), 'utf8');
let html = readFileSync(join(dir, 'src', 'index.html'), 'utf8');
html = html.replace('/*__FONTS__*/', () => fonts.join('\n')).replace('/*__QRCODE__*/', () => qr);

writeFileSync(join(dir, 'Eyal-Invoices.html'), html);
console.log(`Eyal-Invoices.html  ${(html.length / 1024).toFixed(0)} KB`);
