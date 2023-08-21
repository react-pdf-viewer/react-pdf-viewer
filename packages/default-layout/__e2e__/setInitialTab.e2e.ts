import 'expect-puppeteer';
import puppeteer from 'puppeteer';

test('Set the initial tab', async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/default-layout-initial-tab');
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.evaluate(() => document.querySelector('[data-testid="core__viewer"]')?.scrollIntoView());

    // Wait until the initial page is rendered
    await page.waitForSelector('[data-testid="core__page-layer-0"]', { visible: true });

    const thumbnail = await page.waitForSelector('[aria-label="Thumbnail of page 1"]');
    const props = await thumbnail?.evaluate((ele) => ({
        height: ele.getAttribute('height'),
        width: ele.getAttribute('width'),
        src: ele.getAttribute('src'),
    }));
    expect(props?.src?.length).toEqual(3678);
    expect(props?.src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAAAXNSR0IArs4c6QAACm5JREFUeF7tnX',
    );
    expect(props?.height).toEqual('133.33333333333334px');
    expect(props?.width).toEqual('100px');
    await browser.close();
});
