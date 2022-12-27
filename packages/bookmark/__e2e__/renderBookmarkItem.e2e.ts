import 'expect-puppeteer';

test('Customize bookmark items', async () => {
    await page.goto('http://localhost:3000/bookmark-render-bookmark-item');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Check the first toggle icon
    const firstToggle = await page.waitForSelector('[data-testid="bookmark__toggle-0-1"]');
    let firstToggleIcon = await firstToggle.evaluate((ele) => ele.querySelector('svg path').getAttribute('d'));
    expect(firstToggleIcon).toEqual('M5.651,23.5,18.227,12.374a.5.5,0,0,0,0-.748L5.651.5');

    // Toggle the icon
    await firstToggle.click();
    firstToggleIcon = await firstToggle.evaluate((ele) => ele.querySelector('svg path').getAttribute('d'));
    expect(firstToggleIcon).toEqual('M.541,5.627,11.666,18.2a.5.5,0,0,0,.749,0L23.541,5.627');
});
