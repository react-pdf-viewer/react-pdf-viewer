import 'expect-puppeteer';

test('Test the whole words matching', async () => {
    await page.goto('http://localhost:3000/search-custom-control');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    const keywordInput = await page.waitForSelector('[data-testid="keyword-input"]', {
        visible: true,
    });
    await keywordInput?.focus();
    await keywordInput?.type('PDF file');
    await keywordInput?.press('Enter');

    // Check the number of matches
    let numOfMatchesLabel = await page.waitForSelector('[data-testid="num-matches"]');
    let numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('1 of 15');

    // Jump to the 4th page
    const nextMatchButton = await page.waitForSelector('[data-testid="next-match-button"]');

    // `await nextMatchButton.click({ clickCount: 3 })` does NOT work
    await nextMatchButton?.click();
    await nextMatchButton?.click();
    await nextMatchButton?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });

    // There are 4 items found on the 4th page
    let searchHighlights = await page.waitForSelector('[data-testid="search__highlights-3"]', { visible: true });

    let highlightElements = await searchHighlights?.$$('.rpv-search__highlight');
    let numHighlights = await highlightElements?.length;
    expect(numHighlights).toEqual(4);

    // Enable the `Whole Words` option
    const matchWholeWordsButton = await page.waitForSelector('[data-testid="match-whole-words"]');
    await matchWholeWordsButton?.click();

    numOfMatchesLabel = await page.waitForSelector('[data-testid="num-matches"]');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('1 of 3');

    searchHighlights = await page.waitForSelector('[data-testid="search__highlights-3"]', { visible: true });
    highlightElements = await searchHighlights?.$$('.rpv-search__highlight');
    numHighlights = await highlightElements?.length;
    expect(numHighlights).toEqual(2);
});
