import 'expect-puppeteer';

test('Cover component', async () => {
    await page.goto('http://localhost:3000/thumbnail-cover');
    await page.setViewport({
        width: 1200,
        height: 800,
    });
    await page.evaluate(() => document.querySelector('[data-testid="first-doc-cover"]')?.scrollIntoView());

    let imageEle = await page.waitForSelector('[data-testid="first-doc-cover"] [data-testid="thumbnail__cover-image"]');
    let result = await imageEle?.evaluate((node) => ({
        cls: node.getAttribute('class'),
        src: node.getAttribute('src'),
        height: node.clientHeight,
        width: node.clientWidth,
    }));

    expect(result?.cls).toEqual('rpv-thumbnail__cover-image');
    expect(result?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAAE+CAYAAACKpyy5AAAAAXNSR0IArs4c6QAAIABJREFUeF7tnQ'
    );
    expect(result?.src?.length).toEqual(14026);
    expect(result?.height).toEqual(318);
    expect(result?.width).toEqual(238);

    // Load the Cover of the second document
    await page.evaluate(() => document.querySelector('[data-testid="second-doc-cover"]')?.scrollIntoView());

    imageEle = await page.waitForSelector('[data-testid="second-doc-cover"] [data-testid="thumbnail__cover-image"]');
    result = await imageEle?.evaluate((node) => ({
        cls: node.getAttribute('class'),
        src: node.getAttribute('src'),
        height: node.clientHeight,
        width: node.clientWidth,
    }));

    expect(result?.cls).toEqual('rpv-thumbnail__cover-image');
    expect(result?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAAE+CAYAAACUbhwKAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3Q'
    );
    expect(result?.src?.length).toEqual(19926);
    expect(result?.height).toEqual(318);
    expect(result?.width).toEqual(224);
});
