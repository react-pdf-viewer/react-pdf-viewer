import { type JestPuppeteerConfig } from 'jest-environment-puppeteer';

const config: JestPuppeteerConfig = {
    launch: {
        // We need it for full-screen plugin test cases
        headless: false,
        product: 'chrome',
    },
};

export default config;
