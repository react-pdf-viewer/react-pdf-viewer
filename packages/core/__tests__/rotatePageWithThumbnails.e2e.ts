import 'expect-puppeteer';

test('Rotate single page with thumbnails using renderPage', async () => {
    await page.goto('http://localhost:3000/core-rotate-page-with-thumbnails');
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

    // Check the thumbnail of the first page
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

    // Rotate backward the first page
    const rotateBackwardBtn = await page.waitForSelector('[data-testid="rotate-backward-0"]');
    await rotateBackwardBtn?.click();

    // Check the size of the first page
    height = await firstPage?.evaluate((ele) => ele.clientHeight);
    width = await firstPage?.evaluate((ele) => ele.clientWidth);
    expect(height).toEqual(297);
    expect(width).toEqual(396);

    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Check the thumbnail of the first page
    firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    props = await firstThumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(4442);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAABkCAYAAACowvMbAAAAAXNSR0IArs4c6QAADKxJREFUeF7tnQ'
    );
    expect(props?.height).toEqual('100px');
    expect(props?.width).toEqual('133.33333333333334px');
});
