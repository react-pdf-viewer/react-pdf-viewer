/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Convert a float number to the ratio of two interger numbers using the Farey approximation algorithm
// See https://the-algorithms.com/algorithm/farey-approximation
export const floatToRatio = (x: number, limit: number): [number, number] => {
    if (Math.floor(x) === x) {
        return [x, 1];
    }

    // Get the inverted value
    const y = 1 / x;
    if (y > limit) {
        return [1, limit];
    }
    if (Math.floor(y) === y) {
        return [1, y];
    }

    // We will start with the value that is in the range of 0 and 1
    const value = x > 1 ? y : x;

    // The lower and upper values are 0/1 and 1/1
    let a = 0;
    let b = 1;
    let c = 1;
    let d = 1;

    // If a/b < c/d, then we continue generating the number (a + c)/(b + d)
    // a/b < (a + c)/(b + d) < c/d
    while (true) {
        let numerator = a + c;
        let denominator = b + d;
        if (denominator > limit) {
            break;
        }
        value <= numerator / denominator ? ([c, d] = [numerator, denominator]) : ([a, b] = [numerator, denominator]);
    }

    const middle = (a / b + c / d) / 2;
    return value < middle ? (value === x ? [a, b] : [b, a]) : value === x ? [c, d] : [d, c];
};
