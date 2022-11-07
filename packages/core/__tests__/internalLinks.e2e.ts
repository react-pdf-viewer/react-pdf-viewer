import 'expect-puppeteer';

test('Jump between internal links', async () => {
    await page.goto('http://localhost:3000/core');
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

    const jumpToTableOfContents = async () => {
        const pagesEle = await page.waitForSelector('[data-testid="core__inner-pages"]');
        await pagesEle?.evaluate((ele) => (ele.scrollTop = 2416));

        // Wait until the page is rendered
        await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
        await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

        await page.waitForSelector('[data-testid="core__page-layer-3"]');
        await page.waitForSelector('[data-testid="core__text-layer-3"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

        await page.waitForSelector('[data-testid="core__page-layer-4"]');
        await page.waitForSelector('[data-testid="core__text-layer-4"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

        await page.waitForSelector('[data-testid="core__page-layer-5"]');
        await page.waitForSelector('[data-testid="core__text-layer-5"]');
        return await page.waitForSelector('[data-testid="core__annotation-layer-5"]');
    };

    // Jump to the 3rd page
    await jumpToTableOfContents();

    // Click the `Preface` link
    let link = await page.waitForSelector('[data-annotation-id="31R"] a');
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3661');

    // Click the `Who should read this guide` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="37R"] a');
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3828');

    // Click the `Related documentation` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="38R"] a');
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3942');

    // Click the `Parameters for Opening PDF Files` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="39R"] a');
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4849');

    // Click the `Parameters` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="34R"] a');
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5353');

    // Click the `Specifying parameters in a URL` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="35R"] a');
    await link?.click();

    await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-6"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7848');
});
