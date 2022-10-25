import 'expect-puppeteer';

test('Test thumbnailWidth option', async () => {
    await page.goto('http://localhost:3000/thumbnail-width');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Check the thumbnail of the first page
    const firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    let props = await firstThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(6974);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADICAYAAAAKhRhlAAAAAXNSR0IArs4c6QAAFBhJREFUeF7tnQ'
    );
    expect(props?.width).toEqual('150px');
    expect(props?.height).toEqual('200px');

    // Check the thumbnail of the second page
    const secondThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 2"]');
    props = await secondThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(18094);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADICAYAAAAKhRhlAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3e'
    );
    expect(props?.width).toEqual('150px');
    expect(props?.height).toEqual('200px');
});
