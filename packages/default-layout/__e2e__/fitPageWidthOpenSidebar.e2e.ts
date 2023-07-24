import 'expect-puppeteer';

test('Keep to fit page width when click sidebar', async () => {
    await page.goto('http://localhost:3000/default-layout-fit-page-with');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Click the `Thumbnail` tab in the sidebar
    const thumbnailTab = await page.waitForSelector('button[aria-label="Thumbnail"]');
    await thumbnailTab?.click();

    // To make sure the thumbnails are rendered
    await page.waitForSelector('[data-testid="thumbnail__list"]');

    // Wait until the thumbnail of second page is rendered
    await page.waitForFunction(() => document.querySelector('[aria-label="Thumbnail of page 2"]'));

    await page.waitForSelector('[data-testid="core__text-layer-0"]');
    await page.waitForSelector('[data-testid="core__text-layer-1"]');

    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=zoom__popover-target-scale]").textContent === "115%"',
    );
});
