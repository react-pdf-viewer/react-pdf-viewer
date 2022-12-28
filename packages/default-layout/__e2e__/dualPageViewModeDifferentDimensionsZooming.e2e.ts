import 'expect-puppeteer';

describe('Keep current position after zooming in dual page viewmode', () => {
    beforeEach(async () => {
        await page.goto('http://localhost:3000/default-layout-different-dimensions');
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

        // Wait until the first page is rendered
        await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-0"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-0"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

        await page.waitForSelector('[data-testid="core__page-layer-1"]');
        await page.waitForSelector('[data-testid="core__text-layer-1"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-1"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-1"]');

        await page.waitForSelector('[data-testid="core__page-layer-2"]');
        await page.waitForSelector('[data-testid="core__text-layer-2"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-2"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

        await page.waitForSelector('[data-testid="core__page-layer-3"]');
        await page.waitForSelector('[data-testid="core__text-layer-3"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-3"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

        await page.waitForSelector('[data-testid="core__page-layer-4"]');
        await page.waitForSelector('[data-testid="core__text-layer-4"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-4"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

        await page.waitForSelector('[data-testid="core__page-layer-5"]');
        await page.waitForSelector('[data-testid="core__text-layer-5"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-5"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-5"]');

        // Switch to the dual page viewmode
        const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
        await moreActionsButton?.click();

        const switchToDualPageMenu = await page.waitForSelector('[data-testid="view-mode__dual-menu"]');
        await switchToDualPageMenu?.click();

        await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-0"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-0"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

        await page.waitForSelector('[data-testid="core__page-layer-1"]');
        await page.waitForSelector('[data-testid="core__text-layer-1"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-1"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-1"]');

        await page.waitForSelector('[data-testid="core__page-layer-2"]');
        await page.waitForSelector('[data-testid="core__text-layer-2"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-2"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

        await page.waitForSelector('[data-testid="core__page-layer-3"]');
        await page.waitForSelector('[data-testid="core__text-layer-3"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-3"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

        await page.waitForSelector('[data-testid="core__page-layer-4"]');
        await page.waitForSelector('[data-testid="core__text-layer-4"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-4"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

        await page.waitForSelector('[data-testid="core__page-layer-5"]');
        await page.waitForSelector('[data-testid="core__text-layer-5"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-5"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-5"]');

        await page.waitForSelector('[data-testid="core__page-layer-6"]');
        await page.waitForSelector('[data-testid="core__text-layer-6"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-6"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-6"]');

        // Jump to the 4th page
        const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
            visible: true,
        });
        await pageInput?.focus();
        await pageInput?.click({ clickCount: 3 });
        await pageInput?.type('4');
        await pageInput?.press('Enter');

        // Wait until the page is rendered
        await page.waitForSelector('[data-testid="core__page-layer-3"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-3"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-3"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

        await page.waitForSelector('[data-testid="core__page-layer-7"]');
        await page.waitForSelector('[data-testid="core__text-layer-7"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-7"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-7"]');

        await page.waitForSelector('[data-testid="core__page-layer-8"]');
        await page.waitForSelector('[data-testid="core__text-layer-8"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-8"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-8"]');

        await page.waitForSelector('[data-testid="core__page-layer-9"]');
        await page.waitForSelector('[data-testid="core__text-layer-9"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-9"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-9"]');

        await page.waitForFunction(() => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 396');

        // Check the current page input
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "3"'
        );
    });

    test('Click the `6.3.4` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="428R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-26"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-26"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-26"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-26"]');

        // Zoom to 200%
        let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
        await zoomPopover?.click();

        let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
        let zoomButtons = await zoomPooverBody?.$$('button');
        await zoomButtons[8]?.click();

        await page.waitForSelector('[data-testid="core__page-layer-26"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-26"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-26"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-26"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 21624'
        );
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "27"'
        );
    });

    test('Click the `6.3.3` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="435R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-23"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-23"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-23"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-23"]');

        // Zoom to 150%
        let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
        await zoomPopover?.click();

        let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
        let zoomButtons = await zoomPooverBody?.$$('button');
        await zoomButtons[7]?.click();

        await page.waitForSelector('[data-testid="core__page-layer-23"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-23"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-23"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-23"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 13914'
        );
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "25"'
        );
    });

    test('Click the `6.3.2` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="427R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-20"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-20"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-20"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-20"]');

        // Zoom to 125%
        let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
        await zoomPopover?.click();

        let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
        let zoomButtons = await zoomPooverBody?.$$('button');
        await zoomButtons[6]?.click();

        await page.waitForSelector('[data-testid="core__page-layer-16"]');
        await page.waitForSelector('[data-testid="core__text-layer-16"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-16"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-16"]');

        await page.waitForSelector('[data-testid="core__page-layer-17"]');
        await page.waitForSelector('[data-testid="core__text-layer-17"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-17"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-17"]');

        await page.waitForSelector('[data-testid="core__page-layer-18"]');
        await page.waitForSelector('[data-testid="core__text-layer-18"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-18"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-18"]');

        await page.waitForSelector('[data-testid="core__page-layer-19"]');
        await page.waitForSelector('[data-testid="core__text-layer-19"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-19"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-19"]');

        await page.waitForSelector('[data-testid="core__page-layer-20"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-20"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-20"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-20"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 10007.5'
        );
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "21"'
        );
    });

    test('Click the `6.3.1.1` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="426R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-19"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-19"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-19"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-19"]');

        // Zoom to 300%
        let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
        await zoomPopover?.click();

        let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
        let zoomButtons = await zoomPooverBody?.$$('button');
        await zoomButtons[6]?.click();

        await page.waitForSelector('[data-testid="core__page-layer-14"]');
        await page.waitForSelector('[data-testid="core__text-layer-14"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-14"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-14"]');

        await page.waitForSelector('[data-testid="core__page-layer-15"]');
        await page.waitForSelector('[data-testid="core__text-layer-15"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-15"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-15"]');

        await page.waitForSelector('[data-testid="core__page-layer-16"]');
        await page.waitForSelector('[data-testid="core__text-layer-16"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-16"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-16"]');

        await page.waitForSelector('[data-testid="core__page-layer-17"]');
        await page.waitForSelector('[data-testid="core__text-layer-17"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-17"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-17"]');

        await page.waitForSelector('[data-testid="core__page-layer-18"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-18"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-18"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-18"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 21642'
        );
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "19"'
        );
    });

    test('Click the `6.3` link', async () => {
        const link = await page.waitForSelector('[data-annotation-id="425R"] a');
        await link?.click();

        await page.waitForSelector('[data-testid="core__page-layer-17"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-17"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-17"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-17"]');

        // Zoom to 100%
        let zoomPopover = await page.waitForSelector('[data-testid="zoom__popover-target"]');
        await zoomPopover?.click();

        let zoomPooverBody = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
        let zoomButtons = await zoomPooverBody?.$$('button');
        await zoomButtons[6]?.click();

        await page.waitForSelector('[data-testid="core__page-layer-12"]');
        await page.waitForSelector('[data-testid="core__text-layer-12"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-12"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-12"]');

        await page.waitForSelector('[data-testid="core__page-layer-13"]');
        await page.waitForSelector('[data-testid="core__text-layer-13"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-13"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-13"]');

        await page.waitForSelector('[data-testid="core__page-layer-14"]');
        await page.waitForSelector('[data-testid="core__text-layer-14"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-14"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-14"]');

        await page.waitForSelector('[data-testid="core__page-layer-15"]');
        await page.waitForSelector('[data-testid="core__text-layer-15"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-15"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-15"]');

        await page.waitForSelector('[data-testid="core__page-layer-16"]');
        await page.waitForSelector('[data-testid="core__text-layer-16"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-16"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-16"]');

        await page.waitForSelector('[data-testid="core__page-layer-17"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-17"]');
        await page.waitForSelector('[data-testid="core__canvas-layer-17"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-17"]');
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8017.5'
        );
        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=page-navigation__current-page-input]").value === "17"'
        );
    });
});
