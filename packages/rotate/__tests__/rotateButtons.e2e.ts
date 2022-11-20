import 'expect-puppeteer';

test('Keep the current page after rotating a document', async () => {
    await page.goto('http://localhost:3000/rotate-buttons');
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

    // Scroll to the 5th page
    const pagesEle = await page.waitForSelector('[data-testid="core__inner-pages"]');
    await pagesEle?.evaluate((ele) => (ele.scrollTop = 2376));

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

    // Rotate forward
    const rotateForward = await page.waitForSelector('[data-testid="rotate__forward-button"]');
    rotateForward.click().catch((e) => e);

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1782');

    // Scroll to the 3rd page
    await pagesEle?.evaluate((ele) => (ele.scrollTop = 891));

    // Rotate backward
    const rotateBackward = await page.waitForSelector('[data-testid="rotate__backward-button"]');
    rotateBackward.click().catch((e) => e);

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1188');
});
