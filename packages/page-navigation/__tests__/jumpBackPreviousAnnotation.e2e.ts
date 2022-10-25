import 'expect-puppeteer';

test('Jump back to the previous clicked link annotation', async () => {
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

    // Press `Tab` to focus on the first element
    await page.keyboard.press('Tab');

    // Scroll to the TOC page
    await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2376');
    await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
    await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

    // Click the `Preface` link
    const clickAnnotation = async () => {
        const links = [
            // `Preface` link
            {
                title: 'Preface',
                dest: 'G3.1500432',
                targetPage: 3,
                targetTop: 3661,
                annotationTop: 2557,
            },
            // `Who should read this guide?` link
            {
                title: 'Who should read this guide?',
                dest: 'G3.1501280',
                targetPage: 3,
                targetTop: 3828,
                annotationTop: 2580,
            },
            // `Related documentation` link
            {
                title: 'Related documentation',
                dest: 'G3.1500436',
                targetPage: 3,
                targetTop: 3942,
                annotationTop: 2599,
            },
            // `Parameters for Opening PDF Files` link
            {
                title: 'Parameters for Opening PDF Files',
                dest: 'G4.1500435',
                targetPage: 4,
                targetTop: 4849,
                annotationTop: 2625,
            },
            // `Parameters` link
            {
                title: 'Parameters',
                dest: 'G4.1501771',
                targetPage: 4,
                targetTop: 5353,
                annotationTop: 2648,
            },
            // `Specifying parameters in a URL` link
            {
                title: 'Specifying parameters in a URL',
                dest: 'G4.1500435',
                targetPage: 6,
                targetTop: 7848,
                annotationTop: 2668,
            },
        ];
        const linkIndex = Math.floor(Math.random() * links.length);
        const { dest, targetPage, targetTop, annotationTop } = links[linkIndex];

        let linkEle = await page.waitForSelector(`a[data-annotation-link-dest="${encodeURIComponent(dest)}"]`);
        await linkEle?.click();
        await page.waitForFunction(
            () => () => `document.querySelector("[data-testid=core__inner-pages]").scrollTop === ${targetTop}`
        );
        await page.waitForSelector(`[data-testid="core__page-layer-${targetPage}"]`, { visible: true });
        await page.waitForSelector(`[data-testid="core__text-layer-${targetPage}"]`, { visible: true });
        await page.waitForSelector(`[data-testid="core__annotation-layer-${targetPage}"]`);

        // The order of keys are imporant
        await page.keyboard.down('MetaLeft');
        await page.keyboard.press('ArrowUp');

        await page.waitForFunction(
            () => () => `document.querySelector("[data-testid=core__inner-pages]").scrollTop === ${annotationTop}`
        );
        await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-2"]', { visible: true });
        await page.waitForSelector('[data-testid="core__annotation-layer-2"]');
    };

    await clickAnnotation();
});
