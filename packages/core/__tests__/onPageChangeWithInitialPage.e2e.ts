import 'expect-puppeteer';

test('Test the onPageChange() callback with initial page', async () => {
    await page.goto('http://localhost:3000/core-initial-page-onpagechange');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    let visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages"]');
    let visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('5');
});
