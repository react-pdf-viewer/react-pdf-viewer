import 'expect-puppeteer';

test('Bookmarks are expanded initially', async () => {
    await page.goto('http://localhost:3000/bookmark-expanded-dynamic-document');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // To make sure the bookmarks are rendered
    let bookmarksContainer = await page.waitForSelector('[data-testid="bookmark__container"]');

    // Check the number of bookmarks
    let numBookmarks = await bookmarksContainer?.evaluate((ele) => ele.querySelectorAll('li').length);
    expect(numBookmarks).toEqual(32);

    // Check the heading 1
    let heading1 = await page.waitForSelector('[aria-label="1 Heading1"]');
    let props1 = await heading1?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props1?.label).toEqual('1 Heading1');
    expect(props1?.level).toEqual('1');
    expect(props1?.text).toEqual('1 Heading1');

    // The heading 2 and 3 aren't rendered
    await page.waitForFunction(() => !document.querySelector('[aria-label="1.1 Heading2"]'));
    await page.waitForFunction(() => !document.querySelector('[aria-label="1.1.1 Heading3"]'));

    // Load the second document
    const loadDoc2Button = await page.waitForSelector('[data-testid="load-doc-2"]', {
        visible: true,
    });
    await loadDoc2Button?.click();

    // Check the number of bookmarks
    bookmarksContainer = await page.waitForSelector('[data-testid="bookmark__container"]');
    numBookmarks = await bookmarksContainer?.evaluate((ele) => ele.querySelectorAll('li').length);
    expect(numBookmarks).toEqual(77);

    // Check the heading 1
    heading1 = await page.waitForSelector('[aria-label="1 Heading1"]');
    props1 = await heading1?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props1?.label).toEqual('1 Heading1');
    expect(props1?.level).toEqual('1');
    expect(props1?.text).toEqual('1 Heading11.1 Heading2');

    // Check the heading 2
    let heading2 = await page.waitForSelector('[aria-label="1.1 Heading2"]');
    let props2 = await heading2?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props2?.label).toEqual('1.1 Heading2');
    expect(props2?.level).toEqual('2');
    expect(props2?.text).toEqual('1.1 Heading2');

    // The heading 3 isn't rendered
    await page.waitForFunction(() => !document.querySelector('[aria-label="1.1.1 Heading3"]'));

    // Load the third document
    const loadDoc3Button = await page.waitForSelector('[data-testid="load-doc-3"]', {
        visible: true,
    });
    await loadDoc3Button?.click();

    // Check the number of bookmarks
    bookmarksContainer = await page.waitForSelector('[data-testid="bookmark__container"]');
    numBookmarks = await bookmarksContainer?.evaluate((ele) => ele.querySelectorAll('li').length);
    expect(numBookmarks).toEqual(78);

    // Check the heading 1
    heading1 = await page.waitForSelector('[aria-label="1 Heading1"]');
    props1 = await heading1?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props1?.label).toEqual('1 Heading1');
    expect(props1?.level).toEqual('1');
    expect(props1?.text).toEqual('1 Heading11.1 Heading21.1.1 Heading3');

    // Check the heading 2
    heading2 = await page.waitForSelector('[aria-label="1.1 Heading2"]');
    props2 = await heading2?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props2?.label).toEqual('1.1 Heading2');
    expect(props2?.level).toEqual('2');
    expect(props2?.text).toEqual('1.1 Heading21.1.1 Heading3');

    // Check the heading 3
    const heading3 = await page.waitForSelector('[aria-label="1.1.1 Heading3"]');
    const props3 = await heading3?.evaluate((ele) => ({
        label: ele.getAttribute('aria-label'),
        level: ele.getAttribute('aria-level'),
        text: ele.textContent,
    }));
    expect(props3?.label).toEqual('1.1.1 Heading3');
    expect(props3?.level).toEqual('3');
    expect(props3?.text).toEqual('1.1.1 Heading3');
});
