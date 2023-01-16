import 'expect-puppeteer';

test('Test the initialPage option with the dual page viewmode', async () => {
    await page.goto('http://localhost:3000/core-initial-page-dual-page');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1596');
});
