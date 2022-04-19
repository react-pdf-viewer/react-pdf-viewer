import 'expect-puppeteer';

test('Test the renderPage option', async () => {
    await page.goto('http://localhost:3000/core-render-page');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    const firstPage = await page.waitForSelector('[data-testid="custom-page-0"]');
    let pageText = await firstPage.evaluate((ele) => ele.textContent);
    expect(pageText).toEqual('Page 1');

    const secondPage = await page.waitForSelector('[data-testid="custom-page-1"]');
    pageText = await secondPage.evaluate((ele) => ele.textContent);
    expect(pageText).toEqual('Page 2');

    const thirdPage = await page.waitForSelector('[data-testid="custom-page-2"]');
    pageText = await thirdPage.evaluate((ele) => ele.textContent);
    expect(pageText).toEqual('Page 3');
});
