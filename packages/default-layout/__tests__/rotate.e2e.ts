import 'expect-puppeteer';

test('Keep the current page after rotating a document', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-0"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

    await page.waitForSelector('[data-testid="core__page-layer-1"]');
    await page.waitForSelector('[data-testid="core__text-layer-1"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-1"]');

    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__text-layer-2"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__text-layer-3"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

    // Jump to the 5th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('5');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-4"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__text-layer-5"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-5"]');

    await page.waitForSelector('[data-testid="core__page-layer-6"]');
    await page.waitForSelector('[data-testid="core__text-layer-6"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-6"]');

    await page.waitForSelector('[data-testid="core__page-layer-7"]');
    await page.waitForSelector('[data-testid="core__text-layer-7"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-7"]');

    // Click the `More actions` button
    const moreActions = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    moreActions.click().catch((e) => e);

    // Rotate forward
    const rotateForward = await page.waitForSelector('[data-testid="rotate__forward-menu"]');
    rotateForward.click().catch((e) => e);

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3564');

    // Scroll to 3rd page
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('3');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-2"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

    await page.waitForSelector('[data-testid="core__page-layer-3"]');
    await page.waitForSelector('[data-testid="core__text-layer-3"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

    await page.waitForSelector('[data-testid="core__page-layer-4"]');
    await page.waitForSelector('[data-testid="core__text-layer-4"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

    await page.waitForSelector('[data-testid="core__page-layer-5"]');
    await page.waitForSelector('[data-testid="core__text-layer-5"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-5"]');

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1782');

    // Click the `More actions` button
    moreActions.click().catch((e) => e);

    // Rotate backward
    const rotateBackward = await page.waitForSelector('[data-testid="rotate__backward-menu"]');
    rotateBackward.click().catch((e) => e);

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2376');
});
