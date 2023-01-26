import 'expect-puppeteer';

test('Rotate single page using renderPage', async () => {
    await page.goto('http://localhost:3000/core-rotate-page');
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

    // Find the text
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

    // Rotate forward the first page
    const rotateForwardBtn = await page.waitForSelector('[data-testid="rotate-forward-0"]');
    await rotateForwardBtn?.click();

    // Check the size of the first page
    height = await firstPage?.evaluate((ele) => ele.clientHeight);
    width = await firstPage?.evaluate((ele) => ele.clientWidth);
    expect(height).toEqual(297);
    expect(width).toEqual(396);

    // Find the text
    textLayer = await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    numTextElements = await textLayer?.evaluate((ele) => ele.childElementCount);
    expect(numTextElements).toEqual(15);

    result = await textLayer?.evaluate((ele) => {
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
