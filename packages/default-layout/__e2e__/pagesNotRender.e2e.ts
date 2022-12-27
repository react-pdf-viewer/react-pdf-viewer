import 'expect-puppeteer';

// https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1128
test('Pages do not render when users zoom the document continuously', async () => {
    await page.goto('http://localhost:3000/5000-of-dummy');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-100"]', { visible: true });
    await page.waitForSelector('[data-testid="core__page-layer-101"]');
    await page.waitForSelector('[data-testid="core__page-layer-102"]');

    // Find the zooming out button
    const zoomOutButton = await page.waitForSelector('[data-testid="zoom__out-button"]');

    // Scale down to 130%
    await zoomOutButton?.click();
    const scaleLabel = await page.waitForSelector('[data-testid="zoom__popover-target-scale"]');
    let currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('130%');

    // Scale down to 110%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('110%');

    // Scale down to 100%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('100%');

    // Scale down to 90%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('90%');

    // Scale down to 80%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('80%');

    // Scale down to 70%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('70%');

    // Scale down to 60%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('60%');

    // Scale down to 50%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('50%');

    // Scale down to 40%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('40%');

    // Scale down to 30%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('30%');

    // Scale down to 20%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('20%');

    // Scale down to 10%
    await zoomOutButton?.click();
    currentScale = await scaleLabel?.evaluate((ele) => ele.textContent);
    expect(currentScale).toEqual('10%');

    await page.waitForFunction(() => 'document.querySelectorAll(".rpv-core__spinner").length === 0');

    // Pages are rendered completely
    for (let i = 97; i < 113; i++) {
        let documentPage = await page.waitForSelector(`[data-testid="core__text-layer-${i}"]`);
        let textContent = await documentPage?.evaluate((ele) => ele.textContent);
        expect(textContent).toEqual('Dummy PDF file');
    }
});
