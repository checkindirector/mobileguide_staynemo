import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)].map(match => match[1]).filter(file => !file.startsWith('//'));
const missing = [...new Set(files)].filter(file => !fs.existsSync(path.join(root, file.slice(1))));
if (missing.length) throw new Error(`Missing assets: ${missing.join(', ')}`);

for (const required of ['assets/styles.css', 'assets/data.js', 'assets/app.js', 'manifest.webmanifest', 'sw.js', 'vercel.json', 'robots.txt', 'sitemap.xml', 'docs/approved_spec.json', 'docs/content-coverage.json', 'docs/external-sources.json', 'docs/device-manual-sources.json']) {
  if (!fs.existsSync(path.join(root, required))) throw new Error(`Missing ${required}`);
}

const source = ['index.html', 'assets/styles.css', 'assets/data.js', 'assets/app.js'].map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
// The AI concierge has been retired; fail deployment if its runtime is restored.
const retiredAi = /concierge|chatPanel|chatInput|openChatFab|renderSearchResults|api\.openai\.com|OPENAI_API_KEY|@ai-sdk\/openai|ai-gateway\.vercel\.sh/i;
if (retiredAi.test(source)) throw new Error('Retired AI chatbot runtime found');
const packageInfo = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const name of Object.keys({ ...packageInfo.dependencies, ...packageInfo.devDependencies })) {
  if (name === 'openai' || name === 'ai' || name.startsWith('@ai-sdk/')) throw new Error(`Retired AI dependency found: ${name}`);
}
for (const forbidden of ['Another House', 'EXTAY', 'undefined', 'TODO']) {
  if (source.includes(forbidden)) throw new Error(`Forbidden text found: ${forbidden}`);
}
if (!source.includes('STAY NEMO')) throw new Error('Brand text missing');
if (!source.includes('otaLinks')) throw new Error('OTA link configuration missing');
for (const heroPhoto of ['hero-main-professional.webp', 'photographer-202608/livingroom-02.webp', 'photographer-202608/livingroom-04.webp', 'photographer-202608/R1-NEMO-03.webp']) {
  if (!source.includes(heroPhoto)) throw new Error(`Approved hero asset missing: ${heroPhoto}`);
}
for (const [guide, guidePath] of [
  ['doorlock-night-clean-v2.png', 'assets/images/doorlock-night-clean-v2.png'],
  ['aircon-remote-source-v61.webp', 'assets/images/guides/aircon-remote-source-v61.webp'],
  ['official-samsung-ko-v61.webp', 'assets/images/guides/official-samsung-ko-v61.webp'],
  ['official-samsung-en-v61.webp', 'assets/images/guides/official-samsung-en-v61.webp'],
  ['tv-remote-clean-v46.png', 'assets/images/guides/tv-remote-clean-v46.png']
]) {
  const isArchivedReference = guide === 'official-samsung-en-v61.webp';
  if ((!isArchivedReference && !source.includes(guide)) || !fs.existsSync(path.join(root, guidePath))) {
    throw new Error(`Corrected guide asset missing: ${guidePath}`);
  }
}
if (!source.includes('logo-staynemo-official.png') || !source.includes('logo-staynemo-symbol-official.png')) {
  throw new Error('Official STAY NEMO logo assets missing');
}
for (const color of ['#42413e', '#f4f0e8', '#6d4a34', '#b08a4a', '#26231f']) {
  if (!source.toLowerCase().includes(color)) throw new Error(`Approved brand color missing: ${color}`);
}

const approved = JSON.parse(fs.readFileSync(path.join(root, 'docs/approved_spec.json'), 'utf8'));
if (approved.approvalStatus !== 'approved') throw new Error('Approved specification is not frozen');

const images = fs.readdirSync(path.join(root, 'assets/images')).filter(file => file.endsWith('.webp'));
if (images.length < 44) throw new Error(`Expected optimized photo set and OG image; found ${images.length}`);
console.log(`Validated STAY NEMO site: ${images.length} webp images, ${new Set(files).size} linked assets.`);
