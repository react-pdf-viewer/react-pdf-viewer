import 'expect-puppeteer';
test('Document with different page dimensions (horizontal scroll mode)', async () => {
    await page.goto('http://localhost:3000/default-layout-different-dimensions');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Switch to the horizontal scroll mode
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton.click();

    const switchToHorizontalMenu = await page.waitForSelector('[data-testid="scroll-mode__horizontal-menu"]');
    await switchToHorizontalMenu.click();

    // Zoom to 75%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover.waitForSelector('button:nth-of-type(5)');
    const zoomLevel = await zoomMenuItem.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('75%');
    await zoomMenuItem.click();

    // Jump to the 2nd page
    let nextPageButton = await page.waitForSelector('[data-testid="page-navigation__next-button"]');
    await nextPageButton.click();

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    let scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(461);

    // Jump to the 3rd page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(1071);

    // Jump to the 4th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(1533);

    // Jump to the 5th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(2143);

    // Jump to the 6th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-5"]', { visible: true });
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(2753);

    // Jump to the 7th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(3161);

    // Jump to the 8th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
    expect(scrollLeft).toEqual(3161);
});
