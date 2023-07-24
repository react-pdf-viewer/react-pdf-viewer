import 'expect-puppeteer';

test('Rotate single page with thumbnails using renderThumbnailItem', async () => {
    await page.goto('http://localhost:3000/default-layout-rotate-page');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    const firstPage = await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    let height = await firstPage?.evaluate((ele) => ele.clientHeight);
    let width = await firstPage?.evaluate((ele) => ele.clientWidth);
    expect(height).toEqual(396);
    expect(width).toEqual(297);

    // Click the `Thumbnails` tab in the sidebar
    const thumbnailsTab = await page.waitForSelector('button[aria-label="Thumbnails"]');
    await thumbnailsTab?.click();

    // Check the thumbnail of the first page
    const firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    let props = await firstThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(3678);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAAAXNSR0IArs4c6QAACm5JREFUeF7tnX',
    );
    expect(props?.width).toEqual('100px');

    // Rotate backward the second page
    const rotateBackwardBtn = await page.waitForSelector('[data-testid="rotate-backward-1"]');
    await rotateBackwardBtn?.click();

    // Check the size of the second page
    const secondPage = await page.waitForSelector('[data-testid="core__page-layer-1"]', { visible: true });
    height = await secondPage?.evaluate((ele) => ele.clientHeight);
    width = await secondPage?.evaluate((ele) => ele.clientWidth);
    expect(height).toEqual(297);
    expect(width).toEqual(396);

    await page.waitForSelector('[data-testid="core__text-layer-1"]', { visible: true });

    // Check the thumbnail of the second page
    const secondThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 2"]');
    props = await secondThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(10834);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAABkCAYAAACowvMbAAAAAXNSR0IArs4c6QAAH2dJREFUeF7tne',
    );
    expect(props?.height).toEqual('100px');
    expect(props?.width).toEqual('133.33333333333334px');
});
