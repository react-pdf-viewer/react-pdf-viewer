import 'expect-puppeteer';

test('The thumbnails are stuck at loading', async () => {
    await page.goto('http://localhost:3000/thumbnail-stuck-loading');
    await page.setViewport({
        width: 1200,
        height: 800,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]').scrollIntoView());

    // To make sure the thumbnails are rendered
    await page.waitForSelector('[data-testid="thumbnail__list"]');

    const triggerButton = await page.waitForSelector('[data-testid="trigger-rerender"]', {
        visible: true,
    });
    await triggerButton.click();

    // There is no spinner for loading the current document anymore
    const listLoader = await page.$('[data-testid="thumbnail-list__loader"]');
    expect(listLoader).toBeNull();

    const thumbnailItems = await page.$$('.rpv-thumbnail__item');
    expect(thumbnailItems.length).toEqual(8);
});
