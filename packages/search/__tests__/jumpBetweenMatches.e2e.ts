import 'expect-puppeteer';

test('Jump between matches', async () => {
    await page.goto('http://localhost:3000/search-custom-control');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    const keywordInput = await page.waitForSelector('[data-testid="keyword-input"]', {
        visible: true,
    });
    await keywordInput.focus();
    await keywordInput.type('pdf');
    await keywordInput.press('Enter');

    const numOfMatchesLabel = await page.waitForSelector('[data-testid="num-matches"]');
    const numOfMatches = await numOfMatchesLabel.evaluate((node) => node.textContent);
    expect(numOfMatches).toEqual('1 of 40');

    const nextMatchButton = await page.waitForSelector('[data-testid="next-match-button"]');

    // `await nextMatchButton.click({ clickCount: 3 })` does NOT work
    await nextMatchButton.click();
    await nextMatchButton.click();
    await nextMatchButton.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });

    const getPosition = async () => {
        let highlightEle = await page.waitForSelector('.rpv-search__highlight.rpv-search__highlight--current');
        return await highlightEle.evaluate((node) => {
            const nodeEle = node as HTMLElement;
            return {
                index: nodeEle.getAttribute('data-index'),
                left: nodeEle.style.left,
                top: nodeEle.style.top,
            };
        });
    };

    let position = await getPosition();
    expect(position.index).toEqual('0');
    expect(position.left).toEqual('72.1969%');
    expect(position.top).toEqual('15.1042%');

    // Jump to next match
    await nextMatchButton.click();
    position = await getPosition();
    expect(position.index).toEqual('1');
    expect(position.left).toEqual('31.0539%');
    expect(position.top).toEqual('16.6877%');

    await nextMatchButton.click();
    position = await getPosition();
    expect(position.index).toEqual('2');
    expect(position.left).toEqual('60.1307%');
    expect(position.top).toEqual('26.285%');

    await nextMatchButton.click();
    position = await getPosition();
    expect(position.index).toEqual('3');
    expect(position.left).toEqual('37.3104%');
    expect(position.top).toEqual('45.0968%');

    await nextMatchButton.click();
    position = await getPosition();
    expect(position.index).toEqual('4');
    expect(position.left).toEqual('61.2111%');
    expect(position.top).toEqual('45.0968%');

    await nextMatchButton.click();
    position = await getPosition();
    expect(position.index).toEqual('5');
    expect(position.left).toEqual('69.8289%');
    expect(position.top).toEqual('47.9377%');

    await nextMatchButton.click();
    position = await getPosition();
    expect(position.index).toEqual('6');
    expect(position.left).toEqual('43.4949%');
    expect(position.top).toEqual('49.5134%');
});
