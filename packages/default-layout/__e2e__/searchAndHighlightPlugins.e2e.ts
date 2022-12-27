// https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1137
import 'expect-puppeteer';

test('Set initial keyword and use the highlight plugin', async () => {
    await page.goto('http://localhost:3000/default-layout-search-highlight');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');
    await pagesContainer?.evaluate((ele) => (ele.scrollTop = 6019));

    // Jump to the 5th page
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });

    // There are 8 matches on the 5th page
    let searchHighlights = await page.waitForSelector('[data-testid="search__highlights-4"]', { visible: true });
    let highlights = await searchHighlights?.$$('.rpv-search__highlight');
    expect(highlights?.length).toEqual(8);

    // Find the zooming out button
    const zoomOutButton = await page.waitForSelector('[data-testid="zoom__out-button"]');
    await zoomOutButton?.click();

    // Count the number of matches again
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    searchHighlights = await page.waitForSelector('[data-testid="search__highlights-4"]', { visible: true });
    highlights = await searchHighlights?.$$('.rpv-search__highlight');
    expect(highlights?.length).toEqual(8);

    // Jump to the second page
    await pagesContainer?.evaluate((ele) => (ele.scrollTop = 1346));

    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });

    // There are 3 matches on the second page
    searchHighlights = await page.waitForSelector('[data-testid="search__highlights-1"]', { visible: true });
    highlights = await searchHighlights?.$$('.rpv-search__highlight');
    expect(highlights?.length).toEqual(3);
});
