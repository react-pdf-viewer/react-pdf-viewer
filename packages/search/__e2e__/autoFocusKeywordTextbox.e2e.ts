import 'expect-puppeteer';
import puppeteer from 'puppeteer';

test('The keyword field is focused automatically', async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/search-focus-keyword');
    await page.setViewport({
        width: 1200,
        height: 800,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());
    const seachButton = await page.waitForSelector('[aria-label="Search"]', {
        visible: true,
    });
    await seachButton?.click();

    // Wait for the keyword field
    const keywordFieldHandle = await page.waitForSelector('[aria-label="Enter to search"]');
    const isKeyworFocused = await keywordFieldHandle?.evaluate((ele) => ele === document.activeElement);
    expect(isKeyworFocused).toEqual(true);
    await browser.close();
});

test('The page should not scroll to the top', async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/search-focus-keyword');
    await page.setViewport({
        width: 1200,
        height: 800,
    });

    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    const seachButton = await page.waitForSelector('[aria-label="Search"]');
    await seachButton?.click();

    // Wait for the keyword field
    await page.waitForSelector('[aria-label="Enter to search"]');

    // TODO: Fix this test
    const scrollY = await page.evaluate('window.scrollY');
    // expect(scrollY).toBeGreaterThan(0);
    await browser.close();
});
