import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const data = fs.readFileSync('assets/data.js', 'utf8');
const app = fs.readFileSync('assets/app.js', 'utf8');
const css = fs.readFileSync('assets/styles.css', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const approved = JSON.parse(fs.readFileSync('docs/approved_spec.json', 'utf8'));

test('brand and required mobile structure exist', () => {
  assert.match(html, /STAY NEMO/);
  assert.match(html, /bottom-nav/);
  assert.match(html, /data-screen="gallery"/);
  assert.doesNotMatch(html, /data-screen="bathroom"/);
  assert.match(html, /data-screen="appliances"/);
  assert.doesNotMatch(html, /gallery-tabs/);
  assert.match(html, /data-gallery-category="common"[\s\S]*data-gallery-category="nemo"[\s\S]*data-gallery-category="hada"[\s\S]*data-gallery-category="bathroom"/);
  assert.match(html, /id="otaBookingGrid"/);
  assert.match(html, /id="otaGrid"/);
});

test('four languages and configurable OTA links exist', () => {
  for (const lang of ['ko', 'en', 'ja', 'zh']) assert.match(data, new RegExp(`\\b${lang}\\b`));
  for (const ota of ['airbnb', 'booking', 'agoda', 'trip']) assert.match(data, new RegExp(`${ota}: null`));
});

test('routing, lightbox, copy, search, and service worker are wired', () => {
  assert.match(app, /function navigate/);
  assert.match(app, /openLightbox/);
  assert.match(app, /navigator\.clipboard/);
  assert.match(app, /renderSearchResults/);
  assert.match(app, /history\.replaceState/);
  assert.doesNotMatch(app, /location\.hash/);
  assert.match(app, /serviceWorker\.register/);
});

test('approved brand palette and cache revision are applied', () => {
  for (const color of ['#42413e', '#f4f0e8', '#6d4a34', '#b08a4a', '#26231f']) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }
  assert.equal(approved.approvalStatus, 'approved');
  assert.equal(approved.homeImages.main, '공용부_07.jpg');
  assert.match(serviceWorker, /staynemo-v9/);
  assert.match(html, /brand-intro-overlay/);
  assert.match(html, /logo-staynemo\.svg/);
  assert.match(css, /hero-main-professional\.webp/);
  assert.match(css, /hero-sub-professional\.webp/);
  assert.match(css, /hero\.alt \.hero-image-sub\{opacity:1!important/);
  assert.match(css, /wifi-network-grid/);
  assert.doesNotMatch(html, /tel:01059043538/);
  assert.match(html, /data-phone-reveal/);
  assert.match(app, /phoneCallAction/);
  assert.match(html, /menu-photo-hero/);
  assert.match(html, /checkinOutGuide/);
  for (const logo of ['airbnb.svg', 'booking-com.svg', 'agoda.svg', 'trip-com.svg']) assert.match(app, new RegExp(logo.replace('.', '\\.')));
});
