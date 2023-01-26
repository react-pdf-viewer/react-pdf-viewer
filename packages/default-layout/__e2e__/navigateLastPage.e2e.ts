import 'expect-puppeteer';

test('Naivgate to the last page', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Jump to the last page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('8');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8316');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "8"'
    );

    // Zoom to 50%
    let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomPopover?.click();

    let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    let zoomButtons = await zoomPooverBody?.$$('button');
    await zoomButtons[3]?.click();

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2410');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "8"'
    );

    // Jump to the second page ...
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('2');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 396');

    // ... and navigate back to the last page
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('8');
    await pageInput?.press('Enter');

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2410');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "8"'
    );
});
