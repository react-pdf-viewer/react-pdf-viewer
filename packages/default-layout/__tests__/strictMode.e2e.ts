import 'expect-puppeteer';

test('Support Strict mode', async () => {
    await page.goto('http://localhost:3000/default-layout-strict-mode');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    const firstPage = await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    const textElements = await firstPage?.$$('.rpv-core__text-layer-text');
    expect(textElements?.length).toEqual(15);

    // Click the `Thumbnail` tab in the sidebar
    const thumbnailTab = await page.waitForSelector('button[aria-label="Thumbnail"]');
    await thumbnailTab?.click();

    // To make sure the thumbnails are rendered
    await page.waitForSelector('[data-testid="thumbnail__list"]');

    const firstThumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
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
    expect(props?.height).toEqual('133.33333333333334px');
});
