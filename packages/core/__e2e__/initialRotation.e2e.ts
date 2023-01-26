import 'expect-puppeteer';

test('Test the initialRotation option', async () => {
    await page.goto('http://localhost:3000/core-initial-rotation');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the initial page is rendered
    const firstPage = await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    // Check the page size
    const pageSize = await firstPage?.evaluate((ele) => ({
        width: ele.clientWidth,
        height: ele.clientHeight,
    }));
    expect(pageSize?.width).toEqual(871);
    expect(pageSize?.height).toEqual(653);

    let textLayer = await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    let numTextElements = await textLayer?.evaluate((ele) => ele.childElementCount);
    expect(numTextElements).toEqual(15);

    let result = await textLayer?.evaluate((ele) => {
        const textEle = ele.childNodes[2] as HTMLElement;
        return {
            content: textEle.textContent,
            left: textEle.style.left,
            top: textEle.style.top,
        };
    });
    expect(result?.content).toEqual('Parameters for Opening PDF Files');
    expect(result?.left).toEqual('19.14%');
    expect(result?.top).toEqual('42.85%');
});
