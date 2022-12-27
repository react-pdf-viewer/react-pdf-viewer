import 'expect-puppeteer';

test('Press Enter to jump to the next match', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    const seachButton = await page.waitForSelector('[aria-label="Search"]', {
        visible: true,
    });
    await seachButton?.click();

    // Wait for the keyword field
    const keywordInput = await page.waitForSelector('[aria-label="Enter to search"]');

    // Search for "bookmarks"
    await keywordInput?.focus();
    await keywordInput?.type('bookmarks');
    await keywordInput?.press('Enter');

    // Wait until the searching process is completed
    await page.waitForFunction(() => !document.querySelector('[data-testid="search__popover-searching"]'));

    // Check the number of matches
    const numOfMatchesLabel = await page.waitForSelector('[data-testid="search__popover-num-matches"]');
    let numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('1/6');

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5033');

    // Jump to the 2nd match
    await keywordInput?.press('Enter');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 6896');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('2/6');

    // Jump to the 3rd match
    await keywordInput?.press('Enter');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 6897');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('3/6');

    // Jump to the 4th match
    await keywordInput?.press('Enter');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8682');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('4/6');

    // Jump to the 5th match
    await keywordInput?.press('Enter');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8874');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('5/6');

    // Jump to the 6th match
    await keywordInput?.press('Enter');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8874');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('6/6');

    // Jump to the 1st match
    await keywordInput?.press('Enter');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5033');
    numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('1/6');
});
