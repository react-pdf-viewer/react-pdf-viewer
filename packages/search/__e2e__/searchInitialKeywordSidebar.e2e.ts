import 'expect-puppeteer';

test('Perform search for the initial keyword in a sidebar', async () => {
    await page.goto('http://localhost:3000/search-sidebar-initial-keyword');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

    // Check if the keyword is populated properly
    let searchInput = await page.waitForSelector('[placeholder="Enter to search"]');
    let currentKeyword = await searchInput?.evaluate((ele) => (ele as HTMLInputElement).value);
    expect(currentKeyword).toEqual('PDF');

    // Check the number of matches
    let numOfMatchesLabel = await page.waitForSelector('[data-testid="num-matches"]');
    let numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('Found 28 results');

    // Scroll to the first match automatically
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 371');

    // Jump to the next match
    const nextMatchButton = await page.waitForSelector('[aria-label="Next match"]');
    await nextMatchButton?.click();

    await page.waitForSelector('[data-testid="core__page-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-1"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 934');

    // Jump to next matches
    await nextMatchButton?.click();
    await nextMatchButton?.click();
    await nextMatchButton?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2759.5');

    // Jump the previous match
    const previousMatchButton = await page.waitForSelector('[aria-label="Previous match"]');
    await previousMatchButton?.click();
    await previousMatchButton?.click();

    await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-2"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2745.5');
});
