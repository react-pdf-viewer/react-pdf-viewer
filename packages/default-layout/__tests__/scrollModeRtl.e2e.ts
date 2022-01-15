import 'expect-puppeteer';

describe('Scroll modes in RTL', () => {
    test('Vertical scroll mode', async () => {
        await page.goto('http://localhost:3000/default-layout-rtl');
        await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

        // Wait until the first page is rendered
        await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

        const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

        const hasVerticalClass = await pagesContainer.evaluate((ele) =>
            ele.classList.contains('rpv-core__inner-pages--vertical')
        );
        expect(hasVerticalClass).toEqual(true);

        // Jump to the table of contents page
        await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-2"]').scrollIntoView());

        // Click the `Specifying parameters in a URL` link
        const link = await page.waitForSelector('[data-annotation-id="35R"]', { visible: true });
        await link.click();

        await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
        const scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
        expect(scrollTop).toEqual(7944);

        // Check the current page
        const currentPageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]');
        const currentPage = await currentPageInput.evaluate((ele) => ele.getAttribute('value'));
        expect(currentPage).toEqual('7');
    });

    test('Switch to horizontal scroll mode', async () => {
        await page.goto('http://localhost:3000/default-layout-rtl');
        await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

        // Wait until the first page is rendered
        await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

        const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

        const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
        await moreActionsButton.click();

        const switchToHorizontalMenu = await page.waitForSelector('[data-testid="scroll-mode__horizontal-menu"]');
        await switchToHorizontalMenu.click();

        const hasHorizontalClass = await pagesContainer.evaluate((ele) =>
            ele.classList.contains('rpv-core__inner-pages--horizontal')
        );
        expect(hasHorizontalClass).toEqual(true);

        // Jump to the table of contents page
        await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-2"]').scrollIntoView());

        // Click the `Specifying parameters in a URL` link
        const link = await page.waitForSelector('[data-annotation-id="35R"]', { visible: true });
        await link.click();

        await page.waitForSelector('[data-testid="core__text-layer-6"]', { visible: true });
        const scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
        expect(scrollLeft).toEqual(-5496);

        // Check the current page
        const currentPageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]');
        const currentPage = await currentPageInput.evaluate((ele) => ele.getAttribute('value'));
        expect(currentPage).toEqual('7');
    });

    test('Switch to wrapped scroll mode', async () => {
        await page.goto('http://localhost:3000/default-layout-rtl');
        await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

        // Wait until the first page is rendered
        await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

        // Zoom to 75%
        const zoomButton = await page.waitForSelector('[data-testid="zoom__popover-target"]');
        await zoomButton.click();

        const zoomPopover = await page.waitForSelector('[id="rpv-core__popover-body-inner-zoom"]');
        const zoomMenuItem = await zoomPopover.waitForSelector('button:nth-of-type(5)');
        const zoomLevel = await zoomMenuItem.evaluate((ele) => ele.textContent);
        expect(zoomLevel).toEqual('75%');
        await zoomMenuItem.click();

        // Switch to wrapped mode
        const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

        const moreActionsButton = await page.waitForSelector('[data-testid="toolbar__more-actions-popover-target"]');
        await moreActionsButton.click();

        const switchToHWrappedMenu = await page.waitForSelector('[data-testid="scroll-mode__wrapped-menu"]');
        await switchToHWrappedMenu.click();

        const hasWrappedClass = await pagesContainer.evaluate((ele) =>
            ele.classList.contains('rpv-core__inner-pages--wrapped')
        );
        expect(hasWrappedClass).toEqual(true);

        // Jump to the table of contents page
        await page.evaluate(() => document.querySelector('[data-testid="core__page-layer-2"]').scrollIntoView());

        let scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
        expect(scrollTop).toEqual(618);

        // Click the `Parameters` link
        const link = await page.waitForSelector('[data-annotation-id="34R"]', { visible: true });
        await link.click();

        await page.waitForSelector('[data-testid="core__text-layer-4"]', { visible: true });
        scrollTop = await pagesContainer.evaluate((ele) => ele.scrollTop);
        expect(scrollTop).toEqual(1520);
    });
});
