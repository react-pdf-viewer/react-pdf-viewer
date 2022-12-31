/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const getFileExt = (url: string): string => {
    const str = url.split(/\./).pop();
    return str ? str.toLowerCase() : '';
};
