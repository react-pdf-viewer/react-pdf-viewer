import 'expect-puppeteer';

test('Press PageDown to jump to the next page', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

    // Press `Tab` to focus on the first element
    await page.keyboard.press('Tab');

    // Press `PageDown` to jump to the next page
    await page.keyboard.press('PageDown');
    await page.waitForSelector('[data-testid="core__page-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-1"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1188');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "2"'
    );

    // Jump to page 3
    await page.keyboard.press('PageDown');
    await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-2"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2376');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "3"'
    );

    // Jump to page 4
    await page.keyboard.press('PageDown');
    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3564');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "4"'
    );

    // Jump to page 5
    await page.keyboard.press('PageDown');
    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4752');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "5"'
    );

    // Jump to page 6
    await page.keyboard.press('PageDown');
    await page.waitForSelector('[data-testid="core__page-layer-5"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-5"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-5"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5940');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "6"'
    );

    // Jump to page 7
    await page.keyboard.press('PageDown');
    await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-6"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7128');
    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "7"'
    );
});
