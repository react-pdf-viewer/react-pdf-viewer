import 'expect-puppeteer';

test('Keep highlighting after clicking zoom buttons in the default toolbar', async () => {
    await page.goto('http://localhost:3000/search-keyword-toolbar');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Jump to the 5th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput.focus();
    await pageInput.click({ clickCount: 3 });
    await pageInput.type('5');
    await pageInput.press('Enter');

    const getHighlightAreas = async () => {
        await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });

        // Wait for the text layer to be rendered completely
        const textLayer = await page.waitForSelector('[data-testid="core__text-layer-4"]');

        const highlightAreas = await textLayer.$$eval('.rpv-search__highlight', (nodes) =>
            nodes.map((node) => ({
                index: (node as HTMLElement).getAttribute('data-index'),
                height: (node as HTMLElement).style.height,
                width: (node as HTMLElement).style.width,
            }))
        );
        return highlightAreas;
    };

    // Wait for the 5th page
    let areas = await getHighlightAreas();
    expect(areas.length).toEqual(8);

    expect(areas[0].height).toEqual('1.607%');
    expect(areas[0].width).toEqual('7.16717%');
    expect(areas[0].index).toEqual('7');

    expect(areas[1].height).toEqual('1.607%');
    expect(areas[1].width).toEqual('7.1247%');
    expect(areas[1].index).toEqual('6');

    // Click the zoom in button
    const zoomInButton = await page.waitForSelector('[data-testid="zoom__in-button"]');
    await zoomInButton.click();

    areas = await getHighlightAreas();
    expect(areas.length).toEqual(8);

    expect(areas[2].height).toEqual('1.55401%');
    expect(areas[2].width).toEqual('7.29663%');
    expect(areas[2].index).toEqual('5');

    expect(areas[3].height).toEqual('1.55401%');
    expect(areas[3].width).toEqual('7.22995%');
    expect(areas[3].index).toEqual('4');
});
