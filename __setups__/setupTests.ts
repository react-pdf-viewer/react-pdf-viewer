import '@testing-library/jest-dom/extend-expect';
import * as fs from 'node:fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import { ReadableStream } from 'web-streams-polyfill/ponyfill';
import { SimpleMockResizeObserver } from './SimpleMockResizeObserver';

// Polyfill ReadableStream
global.ReadableStream = ReadableStream;

global.ResizeObserver = SimpleMockResizeObserver;

// Fix issue `TextDecoder is not defined`
global.TextDecoder = TextDecoder;

// Mock `clientWidth`, `clientHeight`
Object.defineProperty(window.HTMLElement.prototype, 'clientHeight', {
    get: function () {
        return this.__jsdomMockClientHeight || 0;
    },
});
Object.defineProperty(window.HTMLElement.prototype, 'clientWidth', {
    get: function () {
        return this.__jsdomMockClientWidth || 0;
    },
});

// Mock the `window.scrollTo` function
const noop = () => {};
Object.defineProperty(window, 'scrollTo', {
    value: noop,
    writable: true,
});

// Mock the `window.print` function
Object.defineProperty(window, 'print', {
    value: noop,
    writable: true,
});

// Read data from files and make them available for all tests
const HELLO_PDF = new Uint8Array([
    37, 80, 68, 70, 45, 49, 46, 55, 10, 10, 49, 32, 48, 32, 111, 98, 106, 32, 32, 37, 32, 101, 110, 116, 114, 121, 32,
    112, 111, 105, 110, 116, 10, 60, 60, 10, 32, 32, 47, 84, 121, 112, 101, 32, 47, 67, 97, 116, 97, 108, 111, 103, 10,
    32, 32, 47, 80, 97, 103, 101, 115, 32, 50, 32, 48, 32, 82, 10, 62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 50,
    32, 48, 32, 111, 98, 106, 10, 60, 60, 10, 32, 32, 47, 84, 121, 112, 101, 32, 47, 80, 97, 103, 101, 115, 10, 32, 32,
    47, 77, 101, 100, 105, 97, 66, 111, 120, 32, 91, 32, 48, 32, 48, 32, 50, 48, 48, 32, 50, 48, 48, 32, 93, 10, 32, 32,
    47, 67, 111, 117, 110, 116, 32, 49, 10, 32, 32, 47, 75, 105, 100, 115, 32, 91, 32, 51, 32, 48, 32, 82, 32, 93, 10,
    62, 62, 10, 101, 110, 100, 111, 98, 106, 10, 10, 51, 32, 48, 32, 111, 98, 106, 10, 60, 60, 10, 32, 32, 47, 84, 121,
    112, 101, 32, 47, 80, 97, 103, 101, 10, 32, 32, 47, 80, 97, 114, 101, 110, 116, 32, 50, 32, 48, 32, 82, 10, 32, 32,
    47, 82, 101, 115, 111, 117, 114, 99, 101, 115, 32, 60, 60, 10, 32, 32, 32, 32, 47, 70, 111, 110, 116, 32, 60, 60,
    10, 32, 32, 32, 32, 32, 32, 47, 70, 49, 32, 52, 32, 48, 32, 82, 32, 10, 32, 32, 32, 32, 62, 62, 10, 32, 32, 62, 62,
    10, 32, 32, 47, 67, 111, 110, 116, 101, 110, 116, 115, 32, 53, 32, 48, 32, 82, 10, 62, 62, 10, 101, 110, 100, 111,
    98, 106, 10, 10, 52, 32, 48, 32, 111, 98, 106, 10, 60, 60, 10, 32, 32, 47, 84, 121, 112, 101, 32, 47, 70, 111, 110,
    116, 10, 32, 32, 47, 83, 117, 98, 116, 121, 112, 101, 32, 47, 84, 121, 112, 101, 49, 10, 32, 32, 47, 66, 97, 115,
    101, 70, 111, 110, 116, 32, 47, 84, 105, 109, 101, 115, 45, 82, 111, 109, 97, 110, 10, 62, 62, 10, 101, 110, 100,
    111, 98, 106, 10, 10, 53, 32, 48, 32, 111, 98, 106, 32, 32, 37, 32, 112, 97, 103, 101, 32, 99, 111, 110, 116, 101,
    110, 116, 10, 60, 60, 10, 32, 32, 47, 76, 101, 110, 103, 116, 104, 32, 52, 52, 10, 62, 62, 10, 115, 116, 114, 101,
    97, 109, 10, 66, 84, 10, 55, 48, 32, 53, 48, 32, 84, 68, 10, 47, 70, 49, 32, 49, 50, 32, 84, 102, 10, 40, 72, 101,
    108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33, 41, 32, 84, 106, 10, 69, 84, 10, 101, 110, 100, 115, 116, 114,
    101, 97, 109, 10, 101, 110, 100, 111, 98, 106, 10, 10, 120, 114, 101, 102, 10, 48, 32, 54, 10, 48, 48, 48, 48, 48,
    48, 48, 48, 48, 48, 32, 54, 53, 53, 51, 53, 32, 102, 32, 10, 48, 48, 48, 48, 48, 48, 48, 48, 49, 48, 32, 48, 48, 48,
    48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 48, 55, 57, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48,
    48, 48, 48, 48, 48, 49, 55, 51, 32, 48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 51, 48, 49, 32,
    48, 48, 48, 48, 48, 32, 110, 32, 10, 48, 48, 48, 48, 48, 48, 48, 51, 56, 48, 32, 48, 48, 48, 48, 48, 32, 110, 32,
    10, 116, 114, 97, 105, 108, 101, 114, 10, 60, 60, 10, 32, 32, 47, 83, 105, 122, 101, 32, 54, 10, 32, 32, 47, 82,
    111, 111, 116, 32, 49, 32, 48, 32, 82, 10, 62, 62, 10, 115, 116, 97, 114, 116, 120, 114, 101, 102, 10, 52, 57, 50,
    10, 37, 37, 69, 79, 70,
]);
const DUMMY_PDF = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../samples/dummy.pdf')));
const SAMPLE_PDF = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../samples/sample.pdf')));
const SAMPLE_PROTECTED_PDF = new Uint8Array(
    fs.readFileSync(path.resolve(__dirname, '../samples/sample-protected.pdf')),
);
const MULTIPLE_PAGES_PDF = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../samples/sample-two-pages.pdf')));
const OPEN_PARAMS_PDF = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../samples/pdf-open-parameters.pdf')));

global.console = {
    ...console,
    // I don't want to see pdf-js' warnings
    log: jest.fn(),
};

beforeAll(() => {
    global['__DUMMY_PDF__'] = DUMMY_PDF;
    global['__HELLO_PDF__'] = HELLO_PDF;
    global['__SAMPLE_PDF__'] = SAMPLE_PDF;
    global['__SAMPLE_PROTECTED_PDF__'] = SAMPLE_PROTECTED_PDF;
    global['__MULTIPLE_PAGES_PDF__'] = MULTIPLE_PAGES_PDF;
    global['__OPEN_PARAMS_PDF__'] = OPEN_PARAMS_PDF;

    // Mock the `requestAnimationFrame` function that is used by some hooks such as `useRafState`
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => setTimeout(callback, 0));
});
