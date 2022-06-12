import 'expect-puppeteer';

test('Set the initial tab from document page mode', async () => {
    await page.goto('http://localhost:3000/default-layout-initial-tab-page-mode');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Wait until the bookmark list is rendered
    const bookmarksContainer = await page.waitForSelector('[data-testid="bookmark__container"]');

    // Check the number of bookmarks
    const numBookmarks = await bookmarksContainer?.evaluate((ele) => ele.querySelectorAll('li').length);
    expect(numBookmarks).toEqual(3);

    // Check the last bookmark
    const heading = await page.waitForSelector('[aria-label="Parameters for Opening PDF Files"]');
    const props = await heading?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props?.label).toEqual('Parameters for Opening PDF Files');
    expect(props?.level).toEqual('1');
    expect(props?.text).toEqual('Parameters for Opening PDF Files');

    // Click the `Contents` bookmark item
    let bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Contents"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2473');

    // Click the `Preface` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Preface"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3661');

    // Click the `Parameters for Opening PDF Files` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters for Opening PDF Files"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4849');
});
