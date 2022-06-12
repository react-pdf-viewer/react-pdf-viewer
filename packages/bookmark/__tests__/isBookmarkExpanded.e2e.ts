import 'expect-puppeteer';

test('Set bookmarks expanded initially', async () => {
    await page.goto('http://localhost:3000/bookmark-is-expanded');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // To make sure the bookmarks are rendered
    let bookmarksContainer = await page.waitForSelector('[data-testid="bookmark__container"]');

    // Check the number of bookmarks
    let numBookmarks = await bookmarksContainer?.evaluate((ele) => ele.querySelectorAll('li').length);
    expect(numBookmarks).toEqual(7);

    // Check the last bookmark
    let heading = await page.waitForSelector('[aria-label="Specifying parameters in a URL"]');
    let props = await heading?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props?.label).toEqual('Specifying parameters in a URL');
    expect(props?.level).toEqual('2');
    expect(props?.text).toEqual('Specifying parameters in a URL');
});
