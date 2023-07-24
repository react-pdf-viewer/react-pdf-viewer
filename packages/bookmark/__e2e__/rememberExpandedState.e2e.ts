import 'expect-puppeteer';

test('Remember expanded/collapsed state of each bookmark', async () => {
    await page.goto('http://localhost:3000/bookmark');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="root"]')?.scrollIntoView());

    // Wait until the bookmark list is rendered
    await page.waitForSelector('[data-testid="bookmark__container"]');

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__text-layer-0"]', { visible: true });

    // Toggle the `Parameters for Opening PDF Files` item
    let toggleIcon = await page.waitForSelector(
        'li[aria-label="Parameters for Opening PDF Files"] .rpv-bookmark__toggle',
    );
    await toggleIcon?.click();

    // Toggle the `Specifying parameters in a URL` item
    let toggleSubItem = await page.waitForSelector(
        'li[aria-label="Specifying parameters in a URL"] .rpv-bookmark__toggle',
    );
    await toggleSubItem?.click();

    let subItemHeading = await page.waitForSelector('li[aria-label="Specifying parameters in a URL"]');
    let subItemExpanded = await subItemHeading?.evaluate((ele) => ele.getAttribute('aria-expanded'));
    expect(subItemExpanded).toEqual('true');

    let numSubItems = await subItemHeading?.evaluate((ele) => ele.querySelectorAll('li').length);
    expect(numSubItems).toEqual(2);

    // Close the `Parameters for Opening PDF Files` item
    toggleIcon?.click();

    // and reopen it
    toggleIcon?.click();

    // The `Specifying parameters in a URL` item should be expanded
    subItemHeading = await page.waitForSelector('li[aria-label="Specifying parameters in a URL"]');
    subItemExpanded = await subItemHeading?.evaluate((ele) => ele.getAttribute('aria-expanded'));
    expect(subItemExpanded).toEqual('true');
});
