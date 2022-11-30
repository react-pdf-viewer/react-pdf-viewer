import 'expect-puppeteer';

describe('Link annotation jumps to correct position if the pages have different dimensions', () => {
    beforeEach(async () => {
        await page.goto('http://localhost:3000/core-different-dimensions');
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

        // Wait until the first page is rendered
        await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
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

        // Jump to the 4th page
        const jumpToFourthPage = async () => {
            const pagesEle = await page.waitForSelector('[data-testid="core__inner-pages"]');
            await pagesEle?.evaluate((ele) => (ele.scrollTop = 3759));

            // Wait until the page is rendered
            await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
            await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
            await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

            await page.waitForSelector('[data-testid="core__page-layer-4"]');
            await page.waitForSelector('[data-testid="core__text-layer-4"]');
            await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

            await page.waitForSelector('[data-testid="core__page-layer-5"]');
            await page.waitForSelector('[data-testid="core__text-layer-5"]');
            await page.waitForSelector('[data-testid="core__annotation-layer-5"]');

            await page.waitForSelector('[data-testid="core__page-layer-6"]');
            await page.waitForSelector('[data-testid="core__text-layer-6"]');
            return await page.waitForSelector('[data-testid="core__annotation-layer-6"]');
        };

        await jumpToFourthPage();
    });

    test('Click the `6.3.4` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="428R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-26"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-26"]', { visible: true });
        await page.waitForSelector('[data-testid="core__annotation-layer-26"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 31393'
        );
    });

    test('Click the `6.3.3` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="435R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-23"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-23"]', { visible: true });
        await page.waitForSelector('[data-testid="core__annotation-layer-23"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 27901'
        );
    });

    test('Click the `6.3.2` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="427R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-20"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-20"]', { visible: true });
        await page.waitForSelector('[data-testid="core__annotation-layer-20"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 23619'
        );
    });

    test('Click the `6.3.1.1` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="426R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-19"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-19"]', { visible: true });
        await page.waitForSelector('[data-testid="core__annotation-layer-19"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 22431'
        );
    });

    test('Click the `6.3` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="425R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-17"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-17"]', { visible: true });
        await page.waitForSelector('[data-testid="core__annotation-layer-17"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 20043'
        );
    });
});
