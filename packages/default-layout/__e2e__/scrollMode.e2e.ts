import 'expect-puppeteer';

test('Switch to horizontal scroll mode', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-1"]');
    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__page-layer-4"]');

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    const switchToHorizontalMenu = await page.waitForSelector('[data-testid="scroll-mode__horizontal-menu"]');
    await switchToHorizontalMenu?.click();

    const hasHorizontalClass = await pagesContainer?.evaluate((ele) =>
        ele.classList.contains('rpv-core__inner-pages--horizontal')
    );
    expect(hasHorizontalClass).toEqual(true);
    await page.waitForSelector('[data-testid="core__page-layer-5"]');

    // Jump to the table of contents page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('3');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__inner-current-page-2"]');
    let scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(1782);

    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__page-layer-4"]');
    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    // Click the `Specifying parameters in a URL` link
    const link = await page.waitForSelector('[data-annotation-id="35R"]', { visible: true });
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    await page.waitForSelector('[data-testid="core__inner-current-page-6"]');
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(5413.5);

    // Check the current page
    const currentPage = await pageInput?.evaluate((ele) => ele.getAttribute('value'));
    expect(currentPage).toEqual('7');
});

test('Switch to wrapped scroll mode', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-1"]');
    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__page-layer-4"]');

    // Zoom to 75%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton?.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover?.$('button:nth-of-type(5)');
    const zoomLevel = await zoomMenuItem?.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('75%');
    await zoomMenuItem?.click();

    await page.waitForSelector('[data-testid="core__page-layer-0"]');
    await page.waitForSelector('[data-testid="core__page-layer-1"]');
    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__page-layer-4"]');
    await page.waitForSelector('[data-testid="core__page-layer-5"]');

    // Switch to wrapped mode
    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    const switchToWrappedMenu = await page.waitForSelector('[data-testid="scroll-mode__wrapped-menu"]');
    await switchToWrappedMenu?.click();

    const hasWrappedClass = await pagesContainer?.evaluate((ele) =>
        ele.classList.contains('rpv-core__inner-pages--wrapped')
    );
    expect(hasWrappedClass).toEqual(true);

    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    // Jump to the table of contents page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('3');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__inner-current-page-2"]');
    let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(594);

    // Click the `Parameters` link
    const link = await page.waitForSelector('[data-annotation-id="34R"]');
    await link?.click();

    await page.waitForSelector('[data-testid="core__inner-current-page-6"]');
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(1488.5);
});

test('Keep the current page after switching the scroll mode', async () => {
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

    // Jump to the 4th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('4');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-4"]');
    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    await page.waitForSelector('[data-testid="core__inner-current-page-3"]');
    let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(3564);

    // Switch to the horizontal scroll mode
    let moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();
    const switchToHorizontalMenu = await page.waitForSelector('[data-testid="scroll-mode__horizontal-menu"]');
    await switchToHorizontalMenu?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-4"]');
    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    let scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(2673);

    // Zoom to 50%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton?.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover?.$('button:nth-of-type(4)');
    const zoomLevel = await zoomMenuItem?.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('50%');
    await zoomMenuItem?.click();

    await page.waitForSelector('[data-testid="core__page-layer-0"]');
    await page.waitForSelector('[data-testid="core__page-layer-1"]');
    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-4"]');
    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__page-layer-7"]');

    await page.waitForSelector('[data-testid="core__inner-current-page-3"]');
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(891);
});
