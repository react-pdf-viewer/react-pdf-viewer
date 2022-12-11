import 'expect-puppeteer';

test('Navigate to the previous and next pages in wrapped scroll mode (RTL enabled)', async () => {
    await page.goto('http://localhost:3000/default-layout-rtl');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Switch to the wrapped scroll mode
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    const switchToWrappedMenu = await page.waitForSelector('[data-testid="scroll-mode__wrapped-menu"]');
    await switchToWrappedMenu?.click();

    // Zoom to 75%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton?.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover?.$('button:nth-of-type(5)');
    const zoomLevel = await zoomMenuItem?.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('75%');
    await zoomMenuItem?.click();

    // Click to the next page button
    const nextPageButton = await page.waitForSelector('[data-testid="page-navigation__next-button"]');
    await nextPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 594');

    // Check the current page
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "3"'
    );

    // Click to the next page button again
    await nextPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1188');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "5"'
    );

    // Click to the next page button again
    await nextPageButton?.click();
    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1618');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "7"'
    );

    // Click to the previous page button
    const previousPageButton = await page.waitForSelector('[data-testid="page-navigation__previous-button"]');
    await previousPageButton?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1188');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "5"'
    );

    // Click to the previous page button again
    await previousPageButton?.click();

    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 594');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "3"'
    );

    // Click to the previous page button again
    await previousPageButton?.click();

    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 0');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "1"'
    );
});

test('Jump to a particular page in wrapped scroll mode (RTL enabled)', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Switch to the wrapped scroll mode
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    const switchToWrappedMenu = await page.waitForSelector('[data-testid="scroll-mode__wrapped-menu"]');
    await switchToWrappedMenu?.click();

    // Zoom to 75%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton?.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover?.$('button:nth-of-type(5)');
    const zoomLevel = await zoomMenuItem?.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('75%');
    await zoomMenuItem?.click();

    // Jump to the 6th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('6');
    await pageInput?.press('Enter');

    // Check the current page
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1188');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "5"'
    );

    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('4');
    await pageInput?.press('Enter');

    // Check the current page
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 594');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "3"'
    );

    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('2');
    await pageInput?.press('Enter');

    // Check the current page
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 0');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "1"'
    );
});
