/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const roundToDivide = (a: number, b: number): number => {
    const remainder = a % b;
    return remainder === 0 ? a : Math.round(a - remainder + b);
};
