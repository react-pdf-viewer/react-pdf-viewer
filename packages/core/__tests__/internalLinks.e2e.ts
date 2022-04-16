import 'expect-puppeteer';

test('Jump between internal links', async () => {
    await page.goto('http://localhost:3000/core');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    const jumpToTableOfContents = async () => {
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2416'
        );
        // Wait until the page is rendered
        return await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    };

    // Jump to the 3rd page
    await jumpToTableOfContents();

    // Click the `Preface` link
    let link = await page.waitForSelector('[data-annotation-id="31R"]');
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3709');

    // Click the `Who should read this guide` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="37R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3876');

    // Click the `Related documentation` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="38R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3990');

    // Click the `Parameters for Opening PDF Files` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="39R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4913');

    // Click the `Parameters` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="34R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5417');

    // Click the `Specifying parameters in a URL` link
    await jumpToTableOfContents();
    link = await page.waitForSelector('[data-annotation-id="35R"]', { visible: true });
    await link.click();

    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7944');
});
