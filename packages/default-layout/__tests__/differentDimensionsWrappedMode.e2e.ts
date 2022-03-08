import 'expect-puppeteer';

test('Document with different page dimensions (wrapped scroll mode)', async () => {
    await page.goto('http://localhost:3000/default-layout-different-dimensions');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Switch to the wrapped scroll mode
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton.click();

    const switchToWrappedMenu = await page.waitForSelector('[data-testid="scroll-mode__wrapped-menu"]');
    await switchToWrappedMenu.click();

    // Zoom to 50%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover.waitForSelector('button:nth-of-type(4)');
    const zoomLevel = await zoomMenuItem.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('50%');
    await zoomMenuItem.click();

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-2"]').scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(420);

    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-5"]').scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-5"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(832);

    await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-7"]').scrollIntoView());
    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(890);
});
