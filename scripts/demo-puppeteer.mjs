import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const baseUrl = process.argv[2] || 'http://localhost:5174';
const screenshotDirectory = path.resolve('screenshot/puppeteer');

await mkdir(screenshotDirectory, { recursive: true });

let browser;
let page;

async function saveScreenshot(name) {
  await page.screenshot({
    path: path.join(screenshotDirectory, name),
    fullPage: true
  });
}

async function assertHubNames(expectedNames) {
  const actualNames = await page.$$eval('.hub-item-name', (nodes) =>
    nodes.map((node) => node.textContent.trim())
  );
  assert.deepEqual(actualNames, expectedNames);
}

async function clickButtonWithText(expectedText) {
  const buttons = await page.$$('button');
  for (const button of buttons) {
    if ((await button.evaluate((node) => node.innerText.trim())) === expectedText) {
      await button.click();
      return;
    }
  }
  throw new Error(`Tombol dengan teks "${expectedText}" tidak ditemukan`);
}

async function assertListAndMarkers(expectedCount) {
  await page.waitForFunction((count) => (
    document.querySelectorAll('.hub-item-card').length === count &&
    document.querySelectorAll('.leaflet-overlay-pane path.leaflet-interactive').length === count
  ), { timeout: 10_000 }, expectedCount);

  const listCount = (await page.$$('.hub-item-card')).length;
  const markerCount = (await page.$$('.leaflet-overlay-pane path.leaflet-interactive')).length;
  assert.equal(listCount, expectedCount, 'Jumlah kartu hub tidak sesuai');
  assert.equal(markerCount, expectedCount, 'Jumlah marker hub tidak sesuai');
}

async function step(number, name, assertions) {
  await assertions();
  await saveScreenshot(`${String(number).padStart(2, '0')}-${name}.png`);
}

try {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 250
  });
  page = await browser.newPage();

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (
    document.querySelector('.hub-list-counter-chip')?.textContent.trim() === '6 dari 6 hub' &&
    document.querySelectorAll('.hub-item-card').length === 6
  ), { timeout: 30_000 });

  await step(1, 'dashboard-loaded', async () => {
    assert.equal(
      await page.$eval('.kpi-metric-val', (node) => node.textContent.trim()),
      '6'
    );
    await assertListAndMarkers(6);
  });

  await step(2, 'kpi-verified', async () => {
    const kpiValues = await page.$$eval('.kpi-card', (cards) =>
      cards.map((card) => ({
        label: card.querySelector('.kpi-card-label')?.textContent.trim(),
        value: card.querySelector('.kpi-metric-val')?.textContent.trim()
      }))
    );
    assert.deepEqual(
      kpiValues.slice(0, 3).map(({ label, value }) => [label, value]),
      [
        ['Jumlah hub global', '6'],
        ['Total package_count global', '10.000'],
        ['Hub prioritas global', '3']
      ]
    );
  });

  await step(3, 'top3-verified', async () => {
    const top3Names = await page.$$eval('.top3-hub-name', (nodes) =>
      nodes.map((node) => node.textContent.trim())
    );
    assert.deepEqual(top3Names, ['Makassar Hub', 'Medan Hub', 'Surabaya Hub']);
  });

  await step(4, 'all-hubs-and-markers', async () => {
    await assertListAndMarkers(6);
    await assertHubNames([
      'Makassar Hub',
      'Medan Hub',
      'Surabaya Hub',
      'Semarang Hub',
      'Bandung Hub',
      'Jakarta Hub'
    ]);
  });

  await clickButtonWithText('Prioritas investigasi (3)');
  await step(5, 'priority-filter', async () => {
    await assertListAndMarkers(3);
    await assertHubNames(['Makassar Hub', 'Medan Hub', 'Surabaya Hub']);
  });

  await clickButtonWithText('Semua hub (6)');
  await page.click('input[aria-label="Cari nama atau ID hub"]');
  await page.type('input[aria-label="Cari nama atau ID hub"]', 'Jakarta');
  await page.waitForFunction(() => (
    document.querySelector('.hub-list-counter-chip')?.textContent.trim() === '1 dari 6 hub'
  ), { timeout: 10_000 });
  await step(6, 'search-jakarta', async () => {
    await assertListAndMarkers(1);
    await assertHubNames(['Jakarta Hub']);
  });

  await page.click('.hub-item-card');
  await page.waitForSelector('.hub-detail-panel');
  await step(7, 'jakarta-detail', async () => {
    const detailText = await page.$eval('.hub-detail-panel', (node) => node.innerText);
    assert.match(detailText, /HUB_JKT/);
    assert.match(detailText, /1\.667/);
    assert.match(detailText, /2\.04 jam/);
    assert.match(detailText, /2\.05 jam/);
  });

  await clickButtonWithText('Prioritas investigasi (3)');
  await page.waitForFunction(() => (
    document.querySelector('.empty-state-title')?.textContent.trim() === 'Tidak ada hub yang sesuai kriteria' &&
    document.querySelector('.hub-detail-panel') === null
  ), { timeout: 10_000 });
  await step(8, 'priority-search-empty', async () => {
    await assertListAndMarkers(0);
    assert.equal(await page.$('.hub-detail-panel'), null);
  });

  await clickButtonWithText('Reset Pencarian');
  await page.waitForFunction(() => (
    document.querySelector('.search-input')?.value === '' &&
    document.querySelector('.hub-list-counter-chip')?.textContent.trim() === '6 dari 6 hub'
  ), { timeout: 10_000 });
  await step(9, 'filters-reset', async () => {
    await assertListAndMarkers(6);
    assert.equal(
      await page.$eval('.search-input', (input) => input.value),
      ''
    );
    await assertHubNames([
      'Makassar Hub',
      'Medan Hub',
      'Surabaya Hub',
      'Semarang Hub',
      'Bandung Hub',
      'Jakarta Hub'
    ]);
  });

  await page.setViewport({ width: 390, height: 844 });
  await step(10, 'mobile-390x844', async () => {
    const dimensions = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth
    }));
    assert.equal(dimensions.viewportWidth, 390);
    assert.ok(
      dimensions.documentWidth <= dimensions.viewportWidth &&
      dimensions.bodyWidth <= dimensions.viewportWidth,
      `Terjadi horizontal overflow: ${JSON.stringify(dimensions)}`
    );
  });

  console.log(`Semua skenario browser lulus. Screenshot tersimpan di ${screenshotDirectory}`);
} catch (error) {
  console.error('Skenario browser gagal:', error);
  if (page) {
    try {
      await saveScreenshot('error.png');
    } catch (screenshotError) {
      console.error('Gagal menyimpan screenshot error:', screenshotError);
    }
  }
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}
