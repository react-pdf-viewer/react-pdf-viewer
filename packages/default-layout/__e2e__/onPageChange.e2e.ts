import 'expect-puppeteer';

test('Test the onPageChange() callback with the default layout', async () => {
    await page.goto('http://localhost:3000/default-layout-onpagechange');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    let visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-1"]');
    let visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0');

    // Scroll to the third page
    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-2"]')?.scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-2"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 2');

    // Click the `Specifying parameters in a URL` link
    const link = await page.waitForSelector('[data-annotation-id="35R"]', { visible: true });
    await link?.click();

    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-3"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 2, 6');

    // Scroll to the last page
    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-7"]')?.scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-4"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 2, 6, 7');
});

test('Test the onPageChange() when navigating between pages', async () => {
    await page.goto('http://localhost:3000/default-layout-onpagechange');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    let visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-1"]');
    let visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0');

    // Jump to the next page
    let nextPageButton = await page.waitForSelector('[data-testid="page-navigation__next-button"]');
    await nextPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-2"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 1');

    nextPageButton = await page.waitForSelector('[data-testid="page-navigation__next-button"]');
    await nextPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-3"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 1, 2');

    nextPageButton = await page.waitForSelector('[data-testid="page-navigation__next-button"]');
    await nextPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-4"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 1, 2, 3');

    nextPageButton = await page.waitForSelector('[data-testid="page-navigation__next-button"]');
    await nextPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-5"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 1, 2, 3, 4');

    // Jump back to the previous page
    let previousPageButton = await page.waitForSelector('[data-testid="page-navigation__previous-button"]');
    await previousPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-6"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 1, 2, 3, 4, 3');

    previousPageButton = await page.waitForSelector('[data-testid="page-navigation__previous-button"]');
    await previousPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-7"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 1, 2, 3, 4, 3, 2');

    previousPageButton = await page.waitForSelector('[data-testid="page-navigation__previous-button"]');
    await previousPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    visitedPagesLabel = await page.waitForSelector('[data-testid="visited-pages-8"]');
    visitedPages = await visitedPagesLabel?.evaluate((ele) => ele.textContent);
    expect(visitedPages).toEqual('0, 1, 2, 3, 4, 3, 2, 1');
});
