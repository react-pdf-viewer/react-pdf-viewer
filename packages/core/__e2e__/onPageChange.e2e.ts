import 'expect-puppeteer';

test('Test the onPageChange() callback', async () => {
    await page.goto('http://localhost:3000/core-onpagechange');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    let visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages"]');
    let visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0');

    // Scroll to the third page
    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-2"]')?.scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2611');
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 2');

    // Click the `Specifying parameters in a URL` link
    const link = await page.waitForSelector('[data-annotation-id="35R"]', { visible: true });
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7944');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=visited-pages]").textContent === "0, 2, 6"');

    // Scroll to the last page
    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-7"]')?.scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8436');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=visited-pages]").textContent === "0, 2, 6, 7"',
    );
});
