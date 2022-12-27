import 'expect-puppeteer';

test('Document with different page dimensions', async () => {
    await page.goto('http://localhost:3000/default-layout-different-dimensions');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Jump to the 14th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('14');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__text-layer-13"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5148');

    // Jump to the 43rd page
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('43');
    await pageInput?.press('Enter');

    await page.waitForSelector('[data-testid="core__text-layer-42"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 16542');
});
