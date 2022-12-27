import 'expect-puppeteer';

test('Set title for link annotations', async () => {
    await page.goto('http://localhost:3000/core');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-0"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

    await page.waitForSelector('[data-testid="core__page-layer-1"]');
    await page.waitForSelector('[data-testid="core__text-layer-1"]');
    await page.waitForSelector('[data-testid="core__annotation-layer-1"]');

    await page.waitForSelector('[data-testid="core__page-layer-2"]');
    await page.waitForSelector('[data-testid="core__text-layer-2"]');
    const annotationLayer = await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

    const getAttributes = async (id: string) => {
        let link = await annotationLayer.$(`[data-annotation-link="${id}"]`);
        return await link?.evaluate((ele) => ({
            title: ele.getAttribute('title'),
            ariaLabel: ele.getAttribute('aria-label'),
        }));
    };

    // Check the title of the `Preface` link
    let props = await getAttributes('31R');
    expect(props?.title).toEqual('Preface');
    expect(props?.ariaLabel).toEqual('Preface');

    // Check the title of the `Who should read this guide?` link
    props = await getAttributes('37R');
    expect(props?.title).toEqual('Who should read this guide?');
    expect(props?.ariaLabel).toEqual('Who should read this guide?');

    // Check the title of the `Related documentation` link
    props = await getAttributes('38R');
    expect(props?.title).toEqual('Related documentation');
    expect(props?.ariaLabel).toEqual('Related documentation');

    // Check the title of the `Parameters for Opening PDF Files` link
    props = await getAttributes('39R');
    expect(props?.title).toEqual('Parameters for Opening PDF Files');
    expect(props?.ariaLabel).toEqual('Parameters for Opening PDF Files');

    // Check the title of the `Parameters` link
    props = await getAttributes('34R');
    expect(props?.title).toEqual('Parameters');
    expect(props?.ariaLabel).toEqual('Parameters');

    // Check the title of the `Specifying parameters in a URL` link
    props = await getAttributes('35R');
    expect(props?.title).toEqual('Specifying parameters in a URL');
    expect(props?.ariaLabel).toEqual('Specifying parameters in a URL');

    // Check the title of the `URL examples` link
    props = await getAttributes('36R');
    expect(props?.title).toEqual('URL examples');
    expect(props?.ariaLabel).toEqual('URL examples');

    // Check the title of the `URL limitations` link
    props = await getAttributes('33R');
    expect(props?.title).toEqual('URL limitations');
    expect(props?.ariaLabel).toEqual('URL limitations');
});
