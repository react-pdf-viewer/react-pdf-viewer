import 'expect-puppeteer';

test('Document with different page dimensions', async () => {
    await page.goto('http://localhost:3000/default-layout-different-dimensions');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Jump to the 2nd page
    let nextPageButton = await page.waitForSelector('[data-testid="page-navigation__next-button"]');
    await nextPageButton.click();

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(1204);

    // Jump to the 3rd page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(2111);

    // Jump to the 4th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(3315);

    // Jump to the 5th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(4222);

    // Jump to the 6th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-5"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(5129);

    // Jump to the 7th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(6333);

    // Jump to the 8th page
    await nextPageButton.click();
    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(7537);
});
