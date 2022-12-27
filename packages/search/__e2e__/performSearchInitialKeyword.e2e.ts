import 'expect-puppeteer';

test('Search popover performs search based on the initial keyword', async () => {
    await page.goto('http://localhost:3000/default-layout-initial-keyword');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

    // Click the search button in the toolbar
    const seachButton = await page.waitForSelector('[aria-label="Search"]', {
        visible: true,
    });
    await seachButton?.click();

    // Check if the keyword is populated properly
    let searchInput = await page.waitForSelector('[aria-label="Enter to search"]');
    let currentKeyword = await searchInput?.evaluate((ele) => (ele as HTMLInputElement).value);
    expect(currentKeyword).toEqual('PDF');

    // Check the number of matches
    let numOfMatchesLabel = await page.waitForSelector('[data-testid="search__popover-num-matches"]');
    let numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('1/28');

    // Check if the `Match case` option is checked
    let matchCaseCheckBox = await page.waitForSelector('[data-testid="search__popover-match-case"]');
    let isMatchCaseChecked = await matchCaseCheckBox?.evaluate((ele) => (ele as HTMLInputElement).checked);
    expect(isMatchCaseChecked).toEqual(true);

    // Scroll to the first match automatically
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 506');

    // Jump to the next match
    const nextMatchButton = await page.waitForSelector('[aria-label="Next match"]');
    await nextMatchButton?.click();

    await page.waitForSelector('[data-testid="core__page-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-1"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 1274');

    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('2/28');

    // Jump to next matches
    await nextMatchButton?.click();
    await nextMatchButton?.click();
    await nextMatchButton?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3763');

    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('5/28');

    // Jump the previous match
    const previousMatchButton = await page.waitForSelector('[aria-label="Previous match"]');
    await previousMatchButton?.click();
    await previousMatchButton?.click();

    await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-2"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2623');

    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('3/28');

    // Click the `Close` button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // All highlights are removed
    let searchHighlights = await page.waitForSelector('[data-testid="search__highlights-2"]', { visible: true });

    let highlightElements = await searchHighlights?.$$('.rpv-search__highlight');
    let numHighlights = await highlightElements?.length;
    expect(numHighlights).toEqual(0);

    // Open the search popover again
    await seachButton?.click();

    // Keyword is reset
    searchInput = await page.waitForSelector('[aria-label="Enter to search"]');
    currentKeyword = await searchInput?.evaluate((ele) => (ele as HTMLInputElement).value);
    expect(currentKeyword).toEqual('');

    // Check the number of matches
    numOfMatchesLabel = await page.waitForSelector('[data-testid="search__popover-num-matches"]');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('0/0');

    // The `Match case` checkbox is reset
    matchCaseCheckBox = await page.waitForSelector('[data-testid="search__popover-match-case"]');
    isMatchCaseChecked = await matchCaseCheckBox?.evaluate((ele) => (ele as HTMLInputElement).checked);
    expect(isMatchCaseChecked).toEqual(false);
});
