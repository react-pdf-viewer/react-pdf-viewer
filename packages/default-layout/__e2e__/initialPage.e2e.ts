import 'expect-puppeteer';

test('Test the initialPage option', async () => {
    await page.goto('http://localhost:3000/default-layout-initial-page');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-20"]', { visible: true });

    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 25257');

    // Click the `Thumbnails` tab in the sidebar
    const thumbnailTab = await page.waitForSelector('button[aria-label="Thumbnail"]');
    await thumbnailTab?.click();

    // The associated thumbnail should be visible
    await page.waitForFunction(() => 'document.querySelector("[data-testid=thumbnail__list]").scrollTop === 1234');

    const thumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 21"]');
    let props = await thumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(1522);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACNCAYAAABBqd8eAAAAAXNSR0IArs4c6QAABB9JREFUeF7tmE'
    );
    expect(props?.height).toEqual('141.40884813060566px');
    expect(props?.width).toEqual('100px');
});
