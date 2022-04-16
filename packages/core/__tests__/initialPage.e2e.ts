import 'expect-puppeteer';

test('Test the initialPage option', async () => {
    await page.goto('http://localhost:3000/core-initial-page');
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7224');
});
