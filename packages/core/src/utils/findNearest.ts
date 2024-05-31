/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const findNearest = (
    low: number,
    high: number,
    value: number,
    getItemValue: (index: number) => number,
): number => {
    while (low <= high) {
        const middle = ((low + high) / 2) | 0;
        const currentValue = getItemValue(middle);

        if (currentValue < value) {
            low = middle + 1;
        } else if (currentValue > value) {
            high = middle - 1;
        } else {
            return middle;
        }
    }

    return low > 0 ? low - 1 : 0;
};
