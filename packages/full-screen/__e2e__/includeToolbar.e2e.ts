import 'expect-puppeteer';

describe('Include the toolbar', () => {
    test('Include the toolbar', async () => {
        await page.goto('http://localhost:3000/full-screen-include-toolbar');
        await page.setViewport({
            width: 1200,
            height: 800,
        });
        await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

        // To make sure the pages are rendered
        await page.waitForSelector('[data-testid="core__inner-pages"]');

        const fullScreenButton = await page.waitForSelector('[aria-label="Full screen"]', {
            visible: true,
        });
        await fullScreenButton?.click();

        const fullscreenEleId = await page.evaluate(() => document.fullscreenElement?.getAttribute('data-testid'));
        expect(fullscreenEleId).toEqual('default-layout__body');

        const exitFullScreenButton = await page.waitForSelector('[aria-label="Exit full screen"]');
        const exitFullScreenButtonId = await page.evaluate(
            (ele) => ele.getAttribute('data-testid'),
            exitFullScreenButton
        );
        expect(exitFullScreenButtonId).toEqual('full-screen__exit-button-with-tooltip');
        await exitFullScreenButton?.click();

        const fullscreenEle = await page.evaluate(() => document.fullscreenElement);
        expect(fullscreenEle).toBeNull;
    });
});
