import 'expect-puppeteer';

test('Customize the view of a protected document', async () => {
    await page.goto('http://localhost:3000/core-render-protected-view');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    const passwordInput = await page.waitForSelector('[data-testid="password-input"]', {
        visible: true,
    });
    await passwordInput?.focus();
    await passwordInput?.click({ clickCount: 3 });
    await passwordInput?.type('123');

    let submitButton = await page.waitForSelector('[data-testid="submit-button"]');
    await submitButton.click();

    const error = await page.waitForSelector('[data-testid="error"]');
    const message = await error.evaluate((ele) => ele.textContent);
    expect(message).toEqual('The password is invalid. Please try again!');

    // Provide the correct password
    await passwordInput?.type('456');
    await submitButton.click();

    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });
    const textLayer = await page.waitForSelector('[data-testid="core__text-layer-0"]');
    const textElements = await textLayer.$$('.rpv-core__text-layer-text');
    const numTexts = textElements.length;
    expect(numTexts).toEqual(75);
});
