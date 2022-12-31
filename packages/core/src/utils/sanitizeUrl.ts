/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

const INVALID_PROTOCOL = /^([^\w]*)(javascript|data|vbscript)/im;
const HTML_ENTITIES = /&#(\w+)(^\w|;)?/g;
const CTRL_CHARS = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
const URL_SCHEME = /^([^:]+):/gm;

const decodeHtmlEntities = (str: string): string => str.replace(HTML_ENTITIES, (_, dec) => String.fromCharCode(dec));

// Credit to https://github.com/braintree/sanitize-url
export const sanitizeUrl = (url: string, defaultUrl: string = 'about:blank'): string => {
    const result = decodeHtmlEntities(url || '')
        .replace(CTRL_CHARS, '')
        .trim();
    if (!result) {
        return defaultUrl;
    }

    // Check if the target URL starts with relative chars such as `.`, `/`
    const firstChar = result[0];
    if (firstChar === '.' || firstChar === '/') {
        return result;
    }

    // Check the URL scheme
    const parsedUrlScheme = result.match(URL_SCHEME);
    if (!parsedUrlScheme) {
        return result;
    }
    const scheme = parsedUrlScheme[0];
    return INVALID_PROTOCOL.test(scheme) ? defaultUrl : result;
};
