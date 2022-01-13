import 'expect-puppeteer';

describe('Scroll modes', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/default-layout');
    });

    test('Switch to horizontal scroll mode', async () => {
        await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

        // Wait until the first page is rendered
        await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

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

        await page.waitForSelector('[data-testid="core__page-layer-6"]', { visible: true });
        const scrollLeft = await pagesContainer.evaluate((ele) => ele.scrollLeft);
        expect(scrollLeft).toEqual(5496);

        // Check the current page
        const currentPageInput = await page.waitForSelector('[data-testid="page-navigation__current-page-input"]');
        const currentPage = await currentPageInput.evaluate(ele => ele.getAttribute('value'));
        expect(currentPage).toEqual('7');
    });
});
