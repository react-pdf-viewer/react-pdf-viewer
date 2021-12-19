import 'expect-puppeteer';

test('The thumbnails are stuck at loading', async () => {
    await page.goto('http://localhost:3000/thumbnail-stuck-loading');

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // To make sure the thumbnails are rendered
    await page.waitForSelector('[data-testid="thumbnail__list"]');

    let firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    let src = await firstThumbnail.evaluate((ele) => ele.getAttribute('src'));
    expect(src.length).toEqual(3486);
    expect(src.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAAAXNSR0IArs4c6QAACd9JREFUeF7tnW'
    );

    // Trigger re-renderer
    const triggerButton = await page.waitForSelector('[data-testid="trigger-rerender"]', {
        visible: true,
    });
    await triggerButton.click();

    // There is no spinner for loading the current document anymore
    const listLoader = await page.$('[data-testid="thumbnail-list__loader"]');
    expect(listLoader).toBeNull();

    const thumbnailItems = await page.$$('.rpv-thumbnail__item');
    expect(thumbnailItems.length).toEqual(8);

    // Load the second document
    const loadDoc2Button = await page.waitForSelector('[data-testid="load-doc-2"]', {
        visible: true,
    });
    await loadDoc2Button.click();

    // Wait until the current thumbnails are updated
    // The second document has only 1 page, so the thumbnail of second page does not exist
    await page.waitForFunction(() => !document.querySelector('[aria-label="Thumbnail of page 2"]'));

    firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    src = await firstThumbnail.evaluate((ele) => ele.getAttribute('src'));
    expect(src.length).toEqual(5134);
    expect(src.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACNCAYAAABBqd8eAAAAAXNSR0IArs4c6QAADrNJREFUeF7t3F'
    );
});
