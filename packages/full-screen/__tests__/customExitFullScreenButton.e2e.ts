import 'expect-puppeteer';

describe('Test exit full screen mode', () => {
    test('Test exit button', async () => {
        await page.goto('http://localhost:3000/full-screen-exit-button');
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

        const exitButton = await page.waitForSelector('[data-testid="exit-full-screen"]');
        const exitTestId = await page.evaluate((exitButton) => exitButton.getAttribute('data-testid'), exitButton);
        expect(exitTestId).toEqual('exit-full-screen');
    });
});
