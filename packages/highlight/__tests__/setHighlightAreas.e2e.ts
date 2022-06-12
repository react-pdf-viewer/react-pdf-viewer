import 'expect-puppeteer';

test('Test setHighlightAreas() function', async () => {
    await page.goto('http://localhost:3000/highlight-dynamic-areas');
    await page.setViewport({
        width: 1200,
        height: 800,
    });
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('4');
    await pageInput?.press('Enter');

    const firstSecondSetButton = await page.waitForSelector('[data-testid="first-areas"]');
    await firstSecondSetButton?.click();

    const pageEle = await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('.highlight-area', { visible: true });

    let highlightAreas =
        (await pageEle?.$$eval('.highlight-area', (nodes) =>
            nodes.map((node) => ({
                height: (node as HTMLElement).style.height,
                width: (node as HTMLElement).style.width,
            }))
        )) || [];

    expect(highlightAreas.length).toEqual(2);

    expect(highlightAreas[0].height).toEqual('1.55401%');
    expect(highlightAreas[0].width).toEqual('28.1674%');

    expect(highlightAreas[1].height).toEqual('1.55401%');
    expect(highlightAreas[1].width).toEqual('28.7437%');

    const setSecondSetButton = await page.waitForSelector('[data-testid="second-areas"]');
    await setSecondSetButton?.click();

    highlightAreas =
        (await pageEle?.$$eval('.highlight-area', (nodes) =>
            nodes.map((node) => ({
                height: (node as HTMLElement).style.height,
                width: (node as HTMLElement).style.width,
            }))
        )) || [];

    expect(highlightAreas.length).toEqual(1);
    expect(highlightAreas[0].height).toEqual('1.32637%');
    expect(highlightAreas[0].width).toEqual('37.477%');
});
