import 'expect-puppeteer';

test('Calculate scale', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]');
    await page.waitForSelector('[data-testid="core__text-layer-1"]');

    const zoomLabel = await page.waitForSelector('[data-testid=zoom__popover-target-scale]');
    const currentZoom = await zoomLabel?.evaluate((ele) => ele.textContent);
    expect(currentZoom).toEqual('150%');
});
