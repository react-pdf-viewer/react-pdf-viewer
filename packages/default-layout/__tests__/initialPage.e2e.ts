import 'expect-puppeteer';

test('Test the initialPage option', async () => {
    await page.goto('http://localhost:3000/default-layout-initial-page');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7224');
});
