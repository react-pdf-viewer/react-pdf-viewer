import 'expect-puppeteer';
import puppeteer from 'puppeteer';

test('No horizontal scrollbar', async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/default-layout');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the first page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    const pagesContainer = await page.waitForSelector('[data-testid="core__inner-pages"]');

    const clientWidth = await pagesContainer?.evaluate((ele) => ele.clientWidth);
    expect(clientWidth).toEqual(977);

    const scrollWidth = await pagesContainer?.evaluate((ele) => ele.scrollWidth);
    expect(scrollWidth).toEqual(clientWidth);
    await browser.close();
});
