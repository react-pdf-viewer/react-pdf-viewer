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

    // Issue 1197 (https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1197)
    // Scroll to the 6th page
    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-6"]')?.scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-6"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=visited-pages]").textContent === "5, 6"');

    // Scroll to the 7th page
    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-7"]')?.scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-7"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=visited-pages]").textContent === "5, 6, 7"');

    // Jump back to the 5th page
    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-5"]')?.scrollIntoView());
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=visited-pages]").textContent === "5, 6, 7, 5"',
    );
});
