/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const roundToDivide = (a: number, b: number): number => {
    const remainder = a % b;
    return remainder === 0 ? a : Math.floor(a - remainder);
};
