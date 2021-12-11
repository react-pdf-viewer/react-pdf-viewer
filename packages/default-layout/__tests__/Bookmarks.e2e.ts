import 'expect-puppeteer';

test('Click bookmarks', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    // Click the `Bookmark` tab in the sidebar
    const bookmarkTab = await page.waitForSelector('button[aria-label="Bookmark"]');
    await bookmarkTab.click();

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Click the `Contents` bookmark item
    let bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Contents"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(2835);

    // Click the `Preface` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Preface"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(4197);

    // Click the `Who should read this guide` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Who should read this guide?"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(4386);

    // Click the `Related documentation` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Related documentation"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(4515);

    // Click the `Parameters for Opening PDF Files` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters for Opening PDF Files"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(5560);

    // Click the `Parameters` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Parameters"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(6131);

    // Click the `Specifying parameters in a URL` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="Specifying parameters in a URL"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(8990);

    // Click the `URL examples` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL examples"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(9662);

    // Click the `URL limitations` bookmark item
    bookmarkItem = await page.waitForSelector('.rpv-bookmark__title[aria-label="URL limitations"]');
    await bookmarkItem.click();

    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
    expect(scrollTop).toEqual(9953);
});
