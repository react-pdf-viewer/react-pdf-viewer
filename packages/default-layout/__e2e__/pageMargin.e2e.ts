import 'expect-puppeteer';

describe('Page margin', () => {
    beforeEach(async () => {
        await page.goto('http://localhost:3000/default-layout-page-margin');
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
        await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

        await page.waitForSelector('[data-testid="core__page-layer-3"]');
        await page.waitForSelector('[data-testid="core__text-layer-3"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-3"]');
    });

    test('Page size', async () => {
        let pageContainer = await page.waitForSelector('[aria-label="Page 1"]');
        let height = await pageContainer.evaluate((ele) => (ele as HTMLElement).style.height);
        expect(height).toEqual('1218px');

        let pageLayer = await page.waitForSelector('[data-testid="core__page-layer-0"]');
        let pageHeight = await pageLayer.evaluate((ele) => (ele as HTMLElement).style.height);
        expect(pageHeight).toEqual('1188px');
    });

    test('Zoom', async () => {
        // Click the `Zoom document` button in the toolbar
        const zoomButton = await page.waitForSelector('[aria-label="Zoom document"]');
        await zoomButton.click();

        const zoomMenu = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');

        const zoomItems = await zoomMenu.$$('button.rpv-core__menu-item');
        const zoomTo75 = zoomItems.at(4);
        const text = await zoomTo75.evaluate((ele) => ele.textContent);
        expect(text).toEqual('75%');
        await zoomTo75.click();

        await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-0"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-0"]');

        await page.waitForSelector('[data-testid="core__page-layer-1"]');
        await page.waitForSelector('[data-testid="core__text-layer-1"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-1"]');

        await page.waitForSelector('[data-testid="core__page-layer-2"]');
        await page.waitForSelector('[data-testid="core__text-layer-2"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

        await page.waitForSelector('[data-testid="core__page-layer-3"]');
        await page.waitForSelector('[data-testid="core__text-layer-3"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

        let pageContainer = await page.waitForSelector('[aria-label="Page 1"]');
        let height = await pageContainer.evaluate((ele) => (ele as HTMLElement).style.height);
        expect(height).toEqual('624px');

        let pageLayer = await page.waitForSelector('[data-testid="core__page-layer-0"]');
        let pageHeight = await pageLayer.evaluate((ele) => (ele as HTMLElement).style.height);
        expect(pageHeight).toEqual('594px');
    });

    test('Jump to other page', async () => {
        // Jump to the 5th page
        const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
            visible: true,
        });
        await pageInput?.focus();
        await pageInput?.click({ clickCount: 3 });
        await pageInput?.type('5');
        await pageInput?.press('Enter');

        await page.waitForSelector('[data-testid="core__page-layer-4"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-4"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

        await page.waitForSelector('[data-testid="core__page-layer-5"]');
        await page.waitForSelector('[data-testid="core__text-layer-5"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-5"]');

        await page.waitForSelector('[data-testid="core__page-layer-6"]');
        await page.waitForSelector('[data-testid="core__text-layer-6"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-6"]');

        await page.waitForSelector('[data-testid="core__page-layer-7"]');
        await page.waitForSelector('[data-testid="core__text-layer-7"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-7"]');

        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 4872'
        );
    });

    test('Click link annotation', async () => {
        // Jump to the 3rd page
        const pageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]', {
            visible: true,
        });
        await pageInput?.focus();
        await pageInput?.click({ clickCount: 3 });
        await pageInput?.type('3');
        await pageInput?.press('Enter');

        await page.waitForSelector('[data-testid="core__page-layer-2"]', { visible: true });
        await page.waitForSelector('[data-testid="core__text-layer-2"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-2"]');

        await page.waitForSelector('[data-testid="core__page-layer-3"]');
        await page.waitForSelector('[data-testid="core__text-layer-3"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-3"]');

        await page.waitForSelector('[data-testid="core__page-layer-4"]');
        await page.waitForSelector('[data-testid="core__text-layer-4"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-4"]');

        await page.waitForSelector('[data-testid="core__page-layer-5"]');
        await page.waitForSelector('[data-testid="core__text-layer-5"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-5"]');

        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 2436'
        );

        // Click the `Specifying parameters in a URL` link
        const link = await page.waitForSelector('[data-annotation-link="35R"]');
        await link.click();

        await page.waitForSelector('[data-testid="core__page-layer-6"]');
        await page.waitForSelector('[data-testid="core__text-layer-6"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-6"]');

        await page.waitForSelector('[data-testid="core__page-layer-7"]');
        await page.waitForSelector('[data-testid="core__text-layer-7"]');
        await page.waitForSelector('[data-testid="core__annotation-layer-7"]');

        await page.waitForFunction(
            () => 'document.querySelector("[data-testid=core__inner-pages]").scrollTop === 8028'
        );
    });
});
