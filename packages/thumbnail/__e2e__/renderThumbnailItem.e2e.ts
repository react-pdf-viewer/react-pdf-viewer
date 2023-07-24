import 'expect-puppeteer';

test('Test renderThumbnailItem', async () => {
    await page.goto('http://localhost:3000/thumbnail-render-thumbnail-item');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // To make sure the thumbnails are rendered
    await page.waitForSelector('[data-testid="thumbnail__list"]');

    await page.waitForFunction(() => document.querySelector('[aria-label="Thumbnail of page 2"]'));

    // Find the thumbnail of the first page
    const firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    let props = await firstThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));

    expect(props?.src?.length).toEqual(6974);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADICAYAAAAKhRhlAAAAAXNSR0IArs4c6QAAFBhJREFUeF7tnQ',
    );
    expect(props?.width).toEqual('150px');
    expect(props?.height).toEqual('200px');

    // Find the thumbnail of the second page
    const secondThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 2"]');
    props = await secondThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));

    expect(props?.src?.length).toEqual(18094);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADICAYAAAAKhRhlAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3e',
    );
    expect(props?.width).toEqual('150px');
    expect(props?.height).toEqual('200px');
});
