import 'expect-puppeteer';

test('Test the initialPage option', async () => {
    await page.goto('http://localhost:3000/core-initial-page');
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    const scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(7224);
});
