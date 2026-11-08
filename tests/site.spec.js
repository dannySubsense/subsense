import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('entrance, every project, and public package', async ({ page, request }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('./');
  await expect(page.locator('.project-strip a')).toHaveCount(11);
  await expect(page.locator('.sheets')).toHaveJSProperty('muted', true);
  await page.getByRole('button', { name: 'Texture audio', exact: true }).click();
  await expect(page.locator('.sheets')).toHaveJSProperty('muted', false);
  await page.getByRole('button', { name: 'Texture audio', exact: true }).click();
  await expect(page.locator('.sheets')).toHaveJSProperty('muted', true);
  await expect.poll(() => page.locator('.sheets').evaluate(video => video.readyState)).toBeGreaterThanOrEqual(2);
  await page.screenshot({ path: testInfo.outputPath('index.png') });
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', testInfo.project.use.viewport.width);
  const links = await page.locator('.project-strip a').evaluateAll(items => items.map(item => item.getAttribute('href')));
  for (const link of links) {
    await page.goto(`./${link}`);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', testInfo.project.use.viewport.width);
  }
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Archive' }).click();
  await expect(page.locator('.archive-card')).toHaveCount(11);
  expect(errors).toEqual([]);
  for (const path of ['CONTENT-WORKFLOW.md', 'docs/00-PROJECT-CONTEXT.md', 'subsense-original-content/', '.git/config', 'package.json']) {
    expect((await request.get(path)).status()).toBe(404);
  }
  const version = await (await request.get('version.json')).json();
  expect(version.revision).toMatch(/^[0-9a-f]{40}$/);
});

test('Becoming Agential apparatus, playback, keyboard, and accessibility', async ({ page }, testInfo) => {
  await page.goto('./#entry/becoming-agential');
  await expect(page.getByRole('heading', { name: 'Becoming Agential', exact: true })).toBeVisible();
  const opening = page.locator('.process-film video');
  await opening.evaluate(video => video.play());
  await expect.poll(() => opening.evaluate(video => video.currentTime)).toBeGreaterThan(0);
  await page.getByRole('button', { name: '[00] plant', exact: true }).click();
  const signal = page.locator('[data-apparatus-panel="signal"]');
  await expect(signal).toBeVisible();
  await signal.locator('video').evaluate(video => video.play());
  await expect(opening).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name: '[02] TouchDesigner', exact: true }).click();
  await expect(signal.locator('video')).toHaveJSProperty('paused', true);
  await expect(page.locator('[data-apparatus-panel="translation"]')).toBeVisible();
  await page.getByRole('button', { name: '[04] robotic arm', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-apparatus-panel="gesture"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-apparatus-panel="overview"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'whole apparatus' })).toBeFocused();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('becoming-agential.png'), fullPage: true });
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(nav).toBeInViewport();
  await nav.getByRole('link', { name: 'Index' }).click();
  await expect(page.locator('.threshold')).toBeVisible();
});

test('reduced motion and keyboard entrance', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.sheets')).toHaveJSProperty('paused', true);
  await expect(page.locator('.project-strip')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.threshold')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('link', { name: 'Becoming Agential', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main h1')).toHaveText('Becoming Agential');
});
