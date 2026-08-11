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
for (const forbidden of ['Another House', 'EXTAY', 'undefined', 'TODO']) {
  if (source.includes(forbidden)) throw new Error(`Forbidden text found: ${forbidden}`);
}
if (!source.includes('STAY NEMO')) throw new Error('Brand text missing');
if (!source.includes('otaLinks')) throw new Error('OTA link configuration missing');
if (!source.includes('hero-main-professional.webp') || !source.includes('hero-sub-professional.webp')) throw new Error('Professionally treated hero sequence missing');
if (!source.includes('logo-staynemo.svg')) throw new Error('Property-signage logo asset missing');
for (const color of ['#42413e', '#f4f0e8', '#6d4a34', '#b08a4a', '#26231f']) {
  if (!source.toLowerCase().includes(color)) throw new Error(`Approved brand color missing: ${color}`);
}

const approved = JSON.parse(fs.readFileSync(path.join(root, 'docs/approved_spec.json'), 'utf8'));
if (approved.approvalStatus !== 'approved') throw new Error('Approved specification is not frozen');

const images = fs.readdirSync(path.join(root, 'assets/images')).filter(file => file.endsWith('.webp'));
if (images.length < 44) throw new Error(`Expected optimized photo set and OG image; found ${images.length}`);
console.log(`Validated STAY NEMO site: ${images.length} webp images, ${new Set(files).size} linked assets.`);
