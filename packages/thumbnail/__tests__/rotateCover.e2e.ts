import 'expect-puppeteer';

test('Rotate forward a Cover', async () => {
    await page.goto('http://localhost:3000/rotate-cover');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    let image = await page.waitForSelector('[data-testid="thumbnail__cover-image"]');
    let props = await image?.evaluate((ele) => ({
        height: ele.clientHeight,
        width: ele.clientWidth,
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(150554);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA/EAAAL1CAYAAACPJ2Q3AAAAAXNSR0IArs4c6QAAIABJREFUeF7snQ'
    );
    expect(props?.width).toEqual(1009);
    expect(props?.height).toEqual(757);

    // Rotate the page
    const rotateBtn = await page.waitForSelector('[data-testid="rotate-forward"]');
    await rotateBtn?.click();

    image = await page.waitForSelector('[data-testid="thumbnail__cover-image"]');
    props = await image?.evaluate((ele) => ({
        height: ele.clientHeight,
        width: ele.clientWidth,
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(70850);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjcAAAL1CAYAAAA7CMURAAAAAXNSR0IArs4c6QAAIABJREFUeF7svQ'
    );
    expect(props?.width).toEqual(567);
    expect(props?.height).toEqual(757);
});

test('Rotate backward a Cover', async () => {
    await page.goto('http://localhost:3000/rotate-cover');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    await page.waitForSelector('[data-testid="thumbnail__cover-image"]');

    // Rotate the page
    const rotateBtn = await page.waitForSelector('[data-testid="rotate-backward"]');
    await rotateBtn?.click();

    let image = await page.waitForSelector('[data-testid="thumbnail__cover-image"]');
    let props = await image?.evaluate((ele) => ({
        height: ele.clientHeight,
        width: ele.clientWidth,
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(70142);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjcAAAL1CAYAAAA7CMURAAAAAXNSR0IArs4c6QAAIABJREFUeF7snQ'
    );
    expect(props?.width).toEqual(567);
    expect(props?.height).toEqual(757);
});
