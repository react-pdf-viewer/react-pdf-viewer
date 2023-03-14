import 'expect-puppeteer';

test('Scroll to the initial page automatically after resizing the container (1)', async () => {
    await page.goto('http://localhost:3000/default-layout-initial-page');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-20"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-16"]');
    await page.waitForSelector('[data-testid="core__page-layer-17"]');
    await page.waitForSelector('[data-testid="core__page-layer-18"]');
    await page.waitForSelector('[data-testid="core__page-layer-19"]');
    await page.waitForSelector('[data-testid="core__page-layer-21"]');
    await page.waitForSelector('[data-testid="core__page-layer-22"]');
    await page.waitForSelector('[data-testid="core__page-layer-23"]');
    await page.waitForSelector('[data-testid="core__page-layer-24"]');

    const pagesContainer = await page.waitForSelector('[data-testid=core__inner-pages]');
    let top = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(top).toEqual(25257.5);

    // Jump to the 30th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('30');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__page-layer-29"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-25"]');
    await page.waitForSelector('[data-testid="core__page-layer-26"]');
    await page.waitForSelector('[data-testid="core__page-layer-27"]');
    await page.waitForSelector('[data-testid="core__page-layer-28"]');
    await page.waitForSelector('[data-testid="core__page-layer-30"]');
    await page.waitForSelector('[data-testid="core__page-layer-31"]');
    await page.waitForSelector('[data-testid="core__page-layer-32"]');
    await page.waitForSelector('[data-testid="core__page-layer-33"]');

    top = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(top).toEqual(36623.5);

    // Click the `Thumbnails` tab in the sidebar
    const thumbnailTab = await page.waitForSelector('button[aria-label="Thumbnail"]');
    await thumbnailTab?.click();

    top = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(top).toEqual(36623);
});

test('Scroll to the initial page automatically after resizing the container (2)', async () => {
    await page.goto('http://localhost:3000/default-layout-initial-page');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-20"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-16"]');
    await page.waitForSelector('[data-testid="core__page-layer-17"]');
    await page.waitForSelector('[data-testid="core__page-layer-18"]');
    await page.waitForSelector('[data-testid="core__page-layer-19"]');
    await page.waitForSelector('[data-testid="core__page-layer-21"]');
    await page.waitForSelector('[data-testid="core__page-layer-22"]');
    await page.waitForSelector('[data-testid="core__page-layer-23"]');
    await page.waitForSelector('[data-testid="core__page-layer-24"]');

    const pagesContainer = await page.waitForSelector('[data-testid=core__inner-pages]');
    let top = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(top).toEqual(25257.5);

    // Jump to the 30th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('30');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__page-layer-29"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-25"]');
    await page.waitForSelector('[data-testid="core__page-layer-26"]');
    await page.waitForSelector('[data-testid="core__page-layer-27"]');
    await page.waitForSelector('[data-testid="core__page-layer-28"]');
    await page.waitForSelector('[data-testid="core__page-layer-30"]');
    await page.waitForSelector('[data-testid="core__page-layer-31"]');
    await page.waitForSelector('[data-testid="core__page-layer-32"]');
    await page.waitForSelector('[data-testid="core__page-layer-33"]');

    top = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(top).toEqual(36623.5);

    // Zoom to 75%
    let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomPopover?.click();

    let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    let zoomButtons = await zoomPooverBody?.$$('button');
    await zoomButtons[4]?.click();

    top = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(top).toEqual(18311);

    // Click the `Bookmark` tab in the sidebar
    const bookmarkTab = await page.waitForSelector('button[aria-label="Bookmark"]');
    await bookmarkTab?.click();

    top = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(top).toEqual(18311);
});
