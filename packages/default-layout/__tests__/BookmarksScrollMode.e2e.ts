import 'expect-puppeteer';

test('Click bookmarks when switching to the horizontal scroll mode', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Click the `Bookmark` tab in the sidebar
    const bookmarkTab = await page.waitForSelector('button[aria-label="Bookmark"]');
    await bookmarkTab?.click();

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Switch to the horizontal scroll mode
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    const switchToHorizontalMenu = await page.waitForSelector('[data-testid="scroll-mode__horizontal-menu"]');
    await switchToHorizontalMenu?.click();

    // Click the `Contents` bookmark item
    let bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Contents"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 1961');

    // Click the `Preface` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Preface"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 2868');

    // Toggle the `Preface` item
    let toggleIcon = await page.waitForSelector('li[aria-label="Preface"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `Who should read this guide` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Who should read this guide?"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 2775');

    // Click the `Related documentation` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Related documentation"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 2775');

    // Click the `Parameters for Opening PDF Files` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters for Opening PDF Files"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 3775');

    // Toggle the `Parameters for Opening PDF Files` item
    toggleIcon = await page.waitForSelector('li[aria-label="Parameters for Opening PDF Files"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `Parameters` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 3682');

    // Click the `Specifying parameters in a URL` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Specifying parameters in a URL"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 5496');

    // Toggle the `Specifying parameters in a URL` item
    toggleIcon = await page.waitForSelector('li[aria-label="Specifying parameters in a URL"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `URL examples` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL examples"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 6403');

    // Click the `URL limitations` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL limitations"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollLeft === 6403');
});

test('Click bookmarks when switching to the wrapped scroll mode', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Click the `Bookmark` tab in the sidebar
    const bookmarkTab = await page.waitForSelector('button[aria-label="Bookmark"]');
    await bookmarkTab?.click();

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Zoom to 50%
    const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomButton?.click();

    const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomMenuItem = await zoomPopover?.$('button:nth-of-type(4)');
    const zoomLevel = await zoomMenuItem?.evaluate((ele) => ele.textContent);
    expect(zoomLevel).toEqual('50%');
    await zoomMenuItem?.click();

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Switch to the wrapped scroll mode
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    const switchToHWrappedMenu = await page.waitForSelector('[data-testid="scroll-mode__wrapped-menu"]');
    await switchToHWrappedMenu?.click();

    // Click the `Contents` bookmark item
    let bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Contents"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 444');

    // Click the `Preface` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Preface"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 444');

    // Toggle the `Preface` item
    let toggleIcon = await page.waitForSelector('li[aria-label="Preface"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `Who should read this guide` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Who should read this guide?"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 500');

    // Click the `Related documentation` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Related documentation"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 538');

    // Click the `Parameters for Opening PDF Files` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters for Opening PDF Files"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 856');

    // Toggle the `Parameters for Opening PDF Files` item
    toggleIcon = await page.waitForSelector('li[aria-label="Parameters for Opening PDF Files"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `Parameters` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 890');

    // Click the `Specifying parameters in a URL` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Specifying parameters in a URL"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 890');

    // Toggle the `Specifying parameters in a URL` item
    toggleIcon = await page.waitForSelector('li[aria-label="Specifying parameters in a URL"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `URL examples` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL examples"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 890');

    // Click the `URL limitations` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL limitations"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 890');
});
