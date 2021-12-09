import 'expect-puppeteer';

beforeAll(async () => {
    await page.goto('http://localhost:3000/thumbnail-cover');
});

test('Cover component', async () => {
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    const imageEle = await page.waitForSelector('[data-testid="thumbnail__cover-image"]');
    const result = await imageEle.evaluate((node) => ({
        cls: node.getAttribute('class'),
        src: node.getAttribute('src'),
        height: node.clientHeight,
        width: node.clientWidth,
    }));

    expect(result.cls).toEqual('rpv-thumbnail__cover-image');
    expect(result.src.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAA')).toBeTruthy();
    expect(result.src.length).toEqual(13406);
    expect(result.height).toEqual(320);
    expect(result.width).toEqual(240);
});
