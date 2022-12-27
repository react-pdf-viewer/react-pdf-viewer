import 'expect-puppeteer';

test('Keep current position after zooming', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });

    // Jump to the 6th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('3');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2376');

    // Click the `Parameters` link
    const link = await page.waitForSelector('[data-annotation-link="34R"]');
    await link?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5353');

    // Zoom to 50%
    let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomPopover?.click();

    let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    let zoomButtons = await zoomPooverBody?.$$('button');
    await zoomButtons[3]?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1784');

    // Zoom to 75%
    zoomPopover?.click();
    zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    zoomButtons = await zoomPooverBody?.$$('button');
    await zoomButtons[4]?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2676');

    // Zoom to 200%
    zoomPopover?.click();
    zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    zoomButtons = await zoomPooverBody?.$$('button');
    await zoomButtons[8]?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7136');

    // Zoom to 150%
    zoomPopover?.click();
    zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    zoomButtons = await zoomPooverBody?.$$('button');
    await zoomButtons[10]?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 14272');
});
