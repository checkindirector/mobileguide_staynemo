import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const data = fs.readFileSync('assets/data.js', 'utf8');
const app = fs.readFileSync('assets/app.js', 'utf8');

test('brand and required mobile structure exist', () => {
  assert.match(html, /STAY NEMO/);
  assert.match(html, /bottom-nav/);
  assert.match(html, /data-screen="gallery"/);
  assert.match(html, /data-screen="appliances"/);
});

test('four languages and configurable OTA links exist', () => {
  for (const lang of ['ko', 'en', 'ja', 'zh']) assert.match(data, new RegExp(`\\b${lang}\\b`));
  for (const ota of ['airbnb', 'booking', 'agoda', 'trip']) assert.match(data, new RegExp(`${ota}: null`));
});

test('routing, lightbox, copy, and service worker are wired', () => {
  assert.match(app, /function navigate/);
  assert.match(app, /openLightbox/);
  assert.match(app, /navigator\.clipboard/);
  assert.match(app, /serviceWorker\.register/);
});
