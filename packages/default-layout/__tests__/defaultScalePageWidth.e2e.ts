import 'expect-puppeteer';

test('Test the defaultScale to fit page width', async () => {
    await page.goto('http://localhost:3000/default-layout-fit-page-with');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the second page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]');
    await page.waitForSelector('[data-testid="core__text-layer-1"]');

    await page.waitForFunction(
        () => 'document.querySelector("[data-testid=zoom__popover-target-scale]").textContent === "162%"'
    );
});
