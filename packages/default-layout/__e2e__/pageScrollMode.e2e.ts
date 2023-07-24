import 'expect-puppeteer';

test('Single page scroll mode', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());
    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-1"]');
    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__page-layer-4"]');

    // Jump to the page 5
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('5');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    await page.waitForSelector('[data-testid="core__inner-current-page-4"]');
    let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(4752);

    // Switch to the single page scroll mode
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    const switchToPageMenu = await page.waitForSelector('[data-testid="scroll-mode__page-menu"]');
    await switchToPageMenu?.click();

    const hasSingleClass = await pagesContainer?.evaluate((ele) =>
        ele.classList.contains('rpv-core__inner-pages--single'),
    );
    expect(hasSingleClass).toEqual(true);
    await page.waitForSelector('[data-testid="core__inner-current-page-4"]');

    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(4752);

    let currentPage = await pageInput?.evaluate((ele) => ele.getAttribute('value'));
    expect(currentPage).toEqual('5');

    // Zoom to 50%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton?.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover?.$('button:nth-of-type(4)');
    const zoomLevel = await zoomMenuItem?.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('50%');
    await zoomMenuItem?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    // Check if the page 4 is rendered completely
    await page.waitForSelector('[data-testid="core__text-layer-4"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

    await page.waitForSelector('[data-testid="core__inner-current-page-4"]');

    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(3032);

    // Check the current page
    currentPage = await pageInput?.evaluate((ele) => ele.getAttribute('value'));
    expect(currentPage).toEqual('5');
});
