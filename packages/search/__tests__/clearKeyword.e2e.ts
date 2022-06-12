import 'expect-puppeteer';

test('clearKeyword() when the keyword is empty', async () => {
    await page.goto('http://localhost:3000/search-custom-control');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    const keywordInput = await page.waitForSelector('[data-testid="keyword-input"]', {
        visible: true,
    });
    await keywordInput?.focus();
    await keywordInput?.type('document');
    await keywordInput?.press('Enter');

    // Check the number of matches
    const numOfMatchesLabel = await page.waitForSelector('[data-testid="num-matches"]');
    const numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('1 of 22');

    // There are 3 items found on the second page
    let searchHighlights = await page.waitForSelector('[data-testid="search__highlights-1"]', { visible: true });

    let highlightElements = await searchHighlights?.$$('.rpv-search__highlight');
    let numHighlights = await highlightElements?.length;
    expect(numHighlights).toEqual(3);

    // Clear the keyword
    await keywordInput?.focus();
    // await keywordInput.type('') doesn't work
    await keywordInput?.click({ clickCount: 3 });
    await keywordInput?.press('Backspace');
    await keywordInput?.press('Enter');

    // The highlights should be removed
    searchHighlights = await page.waitForSelector('[data-testid="search__highlights-1"]', { visible: true });
    highlightElements = await searchHighlights?.$$('.rpv-search__highlight');
    numHighlights = await highlightElements?.length;
    expect(numHighlights).toEqual(0);
});
