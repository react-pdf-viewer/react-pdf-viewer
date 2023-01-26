import 'expect-puppeteer';

test('jumpToMatch in a custom search sidebar', async () => {
    await page.goto('http://localhost:3000/search-sidebar');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

    // Search for "document"
    const keywordInput = await page.waitForSelector('[data-testid="keyword-input"]', {
        visible: true,
    });
    await keywordInput?.focus();
    await keywordInput?.type('document');
    await keywordInput?.press('Enter');

    // Check the number of matches
    const numOfMatchesLabel = await page.waitForSelector('[data-testid="num-matches"]');
    const numOfMatches = await numOfMatchesLabel?.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('Found 22 results');

    await page.waitForSelector('[data-testid="core__page-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-1"]');

    const getPosition = async (pageIndex: number) => {
        const searchHighlights = await page.waitForSelector(`[data-testid="search__highlights-${pageIndex}"]`, {
            visible: true,
        });
        let highlightEle = await searchHighlights?.$('.rpv-search__highlight.rpv-search__highlight--current');
        return await highlightEle?.evaluate((node) => {
            const nodeEle = node as HTMLElement;
            return {
                index: nodeEle.getAttribute('data-index'),
                left: nodeEle.style.left,
                top: nodeEle.style.top,
            };
        });
    };

    // Check the first hightlight position
    let position = await getPosition(1);
    expect(position?.index).toEqual('0');
    expect(position?.left).toEqual('41.3936%');
    expect(position?.top).toEqual('48.745%');

    // Jump to the last match whose container page isn't in the virtual list
    const lastMatch = await page.waitForSelector('[data-testid="match-21"]');
    await lastMatch?.click();

    await page.waitForSelector('[data-testid="core__page-layer-7"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-7"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-7"]');
    position = await getPosition(7);
    expect(position?.index).toEqual('0');
    expect(position?.left).toEqual('60.8236%');
    expect(position?.top).toEqual('42.1547%');

    // Jump to the second match whose container page isn't in the virtual list
    const secondMatch = await page.waitForSelector('[data-testid="match-1"]');
    await secondMatch?.click();

    await page.waitForSelector('[data-testid="core__page-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-1"]');
    position = await getPosition(1);
    expect(position?.index).toEqual('1');
    expect(position?.left).toEqual('58.9815%');
    expect(position?.top).toEqual('50.135%');
});
