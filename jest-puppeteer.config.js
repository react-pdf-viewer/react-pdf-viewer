module.exports = {
    launch: {
        // Use the current Chrome, so e2e tests give the same results as local development
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        // We need it for full-screen plugin test cases
        headless: false,
        product: 'chrome',
    },
};
