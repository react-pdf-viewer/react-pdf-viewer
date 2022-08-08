import 'expect-puppeteer';

test('Click bookmarks', async () => {
    await page.goto('http://localhost:3000/bookmark');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Click the `Contents` bookmark item
    let bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Contents"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2175');

    // Click the `Preface` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Preface"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3221');

    // Toggle the `Preface` item
    let toggleIcon = await page.waitForSelector('li[aria-label="Preface"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `Who should read this guide` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Who should read this guide?"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3365');

    // Click the `Related documentation` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Related documentation"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3464');

    // Click the `Parameters for Opening PDF Files` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters for Opening PDF Files"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4266');

    // Toggle the `Parameters for Opening PDF Files` item
    toggleIcon = await page.waitForSelector('li[aria-label="Parameters for Opening PDF Files"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `Parameters` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4703');

    // Click the `Specifying parameters in a URL` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Specifying parameters in a URL"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 6897');

    // Toggle the `Specifying parameters in a URL` item
    toggleIcon = await page.waitForSelector('li[aria-label="Specifying parameters in a URL"] .rpv-bookmark__toggle');
    await toggleIcon?.click();

    // Click the `URL examples` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL examples"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7415');

    // Click the `URL limitations` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL limitations"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 7567');
});

// Issue https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1218
test('Click bookmarks 2', async () => {
    await page.goto('http://localhost:3000/bookmark');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Click the `Load other document` button
    const loadOtherDocumentButton = await page.waitForSelector('[data-testid="load-other-doc"]');
    await loadOtherDocumentButton?.click();

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Click the `1 Principle` bookmark item
    let bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="1 Principle"]');
    await bookmarkItem?.click();

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 127');

    // Click the `2 Method Description` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="2 Method Description"]');
    await bookmarkItem?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 202');

    // Click the `2.1 Apparatus/Equipment` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="2.1 Apparatus/Equipment"]');
    await bookmarkItem?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 233');

    // Click the `2.2 Operating Parameters` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="2.2 Operating Parameters"]');
    await bookmarkItem?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 393');

    // Click the `2.3 Reagents` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="2.3 Reagents"]');
    await bookmarkItem?.click();

    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 945');
});
