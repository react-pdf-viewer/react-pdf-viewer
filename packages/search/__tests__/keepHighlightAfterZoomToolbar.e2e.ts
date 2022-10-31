import 'expect-puppeteer';

test('Keep highlighting after clicking zoom buttons in the default toolbar', async () => {
    await page.goto('http://localhost:3000/search-keyword-toolbar');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait for the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Jump to the 5th page
    const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
        visible: true,
    });
    await pageInput?.focus();
    await pageInput?.click({ clickCount: 3 });
    await pageInput?.type('5');
    await pageInput?.press('Enter');

    const getHighlightAreas = async () => {
        // Wait for the text layer to be rendered completely
        const searchHighlights = await page.waitForSelector('[data-testid="search__highlights-4"]', { visible: true });

        const highlightAreas = await searchHighlights?.$$eval('.rpv-search__highlight', (nodes) =>
            nodes.map((node) => ({
                index: (node as HTMLElement).getAttribute('data-index'),
                height: (node as HTMLElement).style.height,
                width: (node as HTMLElement).style.width,
            }))
        );
        return highlightAreas;
    };

    // Wait for the 5th page
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 3484.5');

    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

    let areas = (await getHighlightAreas()) || [];
    expect(areas.length).toEqual(8);

    expect(areas[0].height).toEqual('1.4922%');
    expect(areas[0].width).toEqual('7.20764%');
    expect(areas[0].index).toEqual('0');

    expect(areas[1].height).toEqual('1.4922%');
    expect(areas[1].width).toEqual('7.10418%');
    expect(areas[1].index).toEqual('1');

    // Click the zoom in button
    const zoomInButton = await page.waitForSelector('[data-testid="zoom__in-button"]');
    await zoomInButton?.click();

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4117');
    areas = (await getHighlightAreas()) || [];
    expect(areas.length).toEqual(8);

    expect(areas[2].height).toEqual('1.50545%');
    expect(areas[2].width).toEqual('7.23805%');
    expect(areas[2].index).toEqual('2');

    expect(areas[3].height).toEqual('1.50545%');
    expect(areas[3].width).toEqual('7.20052%');
    expect(areas[3].index).toEqual('3');
});
