import 'expect-puppeteer';

test('Test renderThumbnailItem option with dynamic document', async () => {
    await page.goto('http://localhost:3000/thumbnail-render-thumbnail-item-dynamic-document');

    await page.evaluate(() => document.querySelector('[data-testid="root"]').scrollIntoView());

    // To make sure the thumbnails are rendered
    await page.waitForSelector('[data-testid="thumbnail__list"]');

    await page.waitForFunction(() => !document.querySelector('[aria-label="Thumbnail of page 2"]'));

    let firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    let src = await firstThumbnail.evaluate((ele) => ele.getAttribute('src'));
    expect(src.length).toEqual(3486);
    expect(src.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAAAXNSR0IArs4c6QAACd9JREFUeF7tnW'
    );

    let thumbnailItems = await page.$$('.custom-thumbnail-item');
    expect(thumbnailItems.length).toEqual(8);

    // Load the second document
    const loadDoc2Button = await page.waitForSelector('[data-testid="load-doc-2"]', {
        visible: true,
    });
    await loadDoc2Button.click();

    // Wait until the current thumbnails are updated
    // The second document has 2 pages, so the thumbnail of third page does not exist
    await page.waitForFunction(() => !document.querySelector('[aria-label="Thumbnail of page 3"]'));

    thumbnailItems = await page.$$('.custom-thumbnail-item');
    expect(thumbnailItems.length).toEqual(2);

    firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    src = await firstThumbnail.evaluate((ele) => ele.getAttribute('src'));
    expect(src.length).toEqual(2850);
    expect(src.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACBCAYAAAA2ax9lAAAAAXNSR0IArs4c6QAACAJJREFUeF7tmt'
    );
});
