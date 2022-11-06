import 'expect-puppeteer';

test('jumpToHighlightArea() function', async () => {
    await page.goto('http://localhost:3000/highlight');
    await page.setViewport({
        width: 1200,
        height: 800,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Click the `Notes` tab in the sidebar
    const notesTab = await page.waitForSelector('button[aria-label="Notes"]');
    await notesTab?.click();

    // Click the first note
    const firstNote = await page.waitForSelector('[data-testid="note-1"]');
    await firstNote?.click();

    await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-3"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 5103');

    // Click the second note
    const secondNote = await page.waitForSelector('[data-testid="note-2"]');
    await secondNote?.click();

    await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-4"]');
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 6676');
});
