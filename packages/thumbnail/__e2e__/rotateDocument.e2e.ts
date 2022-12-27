import 'expect-puppeteer';

test('Rotate thumbnails after rotating the document', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Click the `Thumbnails` tab in the sidebar
    const thumbnailTab = await page.waitForSelector('button[aria-label="Thumbnail"]');
    await thumbnailTab?.click();

    // Get the thumbnail of the first page
    let firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    let props = await firstThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(3678);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAAAXNSR0IArs4c6QAACm5JREFUeF7tnX'
    );
    expect(props?.width).toEqual('100px');

    // Click the `More Actions` menu
    const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
    await moreActionsButton?.click();

    // Rotate forward the document
    const rotateForwardMenu = await page.waitForSelector('[data-testid="rotate__forward-menu"]');
    await rotateForwardMenu?.click();

    // Get the thumbnail of the first page
    firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    props = await firstThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(4574);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAABkCAYAAACowvMbAAAAAXNSR0IArs4c6QAADQ9JREFUeF7tXX'
    );
    expect(props?.height).toEqual('100px');
    expect(props?.width).toEqual('133.33333333333334px');
});
