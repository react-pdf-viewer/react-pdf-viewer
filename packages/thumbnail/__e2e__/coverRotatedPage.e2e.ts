import 'expect-puppeteer';

test('Cover of a rotated page', async () => {
    await page.goto('http://localhost:3000/thumbnail-cover-rotated');
    await page.setViewport({
        width: 1200,
        height: 800,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    let imageEle = await page.waitForSelector('[data-testid="thumbnail__cover-image"]');
    let result = await imageEle?.evaluate((node) => ({
        cls: node.getAttribute('class'),
        src: node.getAttribute('src'),
        height: node.clientHeight,
        width: node.clientWidth,
    }));

    expect(result?.cls).toEqual('rpv-thumbnail__cover-image');
    expect(result?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAn4AAAHeCAYAAAAFJAYTAAAAAXNSR0IArs4c6QAAIABJREFUeF7snQ'
    );
    expect(result?.src?.length).toEqual(73242);
    expect(result?.height).toEqual(478);
    expect(result?.width).toEqual(638);
});
