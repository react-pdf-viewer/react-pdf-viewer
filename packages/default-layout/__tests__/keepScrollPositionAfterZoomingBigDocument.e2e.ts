import 'expect-puppeteer';

test('Keep current position after zooming out', async () => {
    await page.goto('http://localhost:3000/5000-of-dummy');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-100"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 126300');

    const pagesEle = await page.waitForSelector('[data-testid="core__inner-pages"]');
    await pagesEle?.evaluate((ele) => (ele.scrollTop = 126788));

    // Find the zoom out button
    const zoomOutButton = await page.waitForSelector('[data-testid="zoom__out-button"]');

    // Zoom out to 130%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 109882');

    // Zoom out to 110%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 92977');

    // Zoom out to 100%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 84524');

    // Zoom out to 90%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 76071');

    // Zoom out to 80%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 67618');

    // Zoom out to 70%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 59165');

    // Zoom out to 60%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 50712');

    // Zoom out to 50%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 42260');

    // Zoom out to 40%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 33808');

    // Zoom out to 30%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 25356');

    // Zoom out to 20%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 16904');

    // Zoom out to 10%
    await zoomOutButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8452');

    // Zoom to 150%
    const zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomPopover?.click();

    const zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    const zoomButtons = await zoomPooverBody?.$$('button');
    const zoomTo150Button = zoomButtons ? zoomButtons[7] : null;
    await zoomTo150Button?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 126780');

    // Find the zoom in button
    const zoomInButton = await page.waitForSelector('[data-testid="zoom__in-button"]');
    await zoomInButton?.click();

    // Zoom in to 170%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 143684');

    // Zoom in to 190%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 160588');

    // Zoom in to 210%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 177492');

    // Zoom in to 240%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 202848');

    // Zoom in to 270%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 228204');

    // Zoom in to 300%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 253560');

    // Zoom in to 330%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 278916');

    // Zoom in to 370%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 312724');

    // Zoom in to 410%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 346532');

    // Zoom in to 460%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 388792');
});

test('Keep current position after zooming in', async () => {
    await page.goto('http://localhost:3000/5000-of-dummy');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-100"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 126300');

    const pagesEle = await page.waitForSelector('[data-testid="core__inner-pages"]');
    await pagesEle?.evaluate((ele) => (ele.scrollTop = 126788));

    // Find the zoom in button
    const zoomInButton = await page.waitForSelector('[data-testid="zoom__in-button"]');
    await zoomInButton?.click();

    // Zoom in to 170%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 143693');

    // Zoom in to 190%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 160598');

    // Zoom in to 210%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 177503');

    // Zoom in to 240%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 202860');

    // Zoom in to 270%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 228217');

    // Zoom in to 300%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 253574');

    // Zoom in to 330%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 278931');

    // Zoom in to 370%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 312740');

    // Zoom in to 410%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 346549');

    // Zoom in to 460%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 388811');

    // Zoom in to 510%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 431073');

    // Zoom in to 570%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 481787');

    // Zoom in to 630%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 532501');

    // Zoom in to 700%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 591667');

    // Zoom in to 770%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 650833');

    // Zoom in to 850%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 718452');

    // Zoom in to 940%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 794523');

    // Zoom in to 1000%
    await zoomInButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 845237');
});

test('Keep current position after zooming to special level', async () => {
    await page.goto('http://localhost:3000/5000-of-dummy');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-100"]', { visible: true });
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 126300');

    const pagesEle = await page.waitForSelector('[data-testid="core__inner-pages"]');
    await pagesEle?.evaluate((ele) => (ele.scrollTop = 126788));

    const zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
    await zoomPopover?.click();

    let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    let zoomButtons = await zoomPooverBody?.$$('button');

    // Zoom to fit page
    const zoomToFitPageButton = zoomButtons ? zoomButtons[1] : null;
    await zoomToFitPageButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 74486');

    // Zoom to fit page width
    await zoomPopover?.click();
    zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
    zoomButtons = await zoomPooverBody?.$$('button');
    const zoomToFitWidthButton = zoomButtons ? zoomButtons[2] : null;
    await zoomToFitWidthButton?.click();
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 136375');
});
