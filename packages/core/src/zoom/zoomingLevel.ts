/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

const LEVELS = [
    0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.4, 2.7, 3.0, 3.3, 3.7, 4.1, 4.6,
    5.1, 5.7, 6.3, 7.0, 7.7, 8.5, 9.4, 10,
];

export const increase = (currentLevel: number): number => {
    const found = LEVELS.find((item) => item > currentLevel);
    return found || currentLevel;
};

export const decrease = (currentLevel: number): number => {
    const found = LEVELS.findIndex((item) => item >= currentLevel);
    return found === -1 || found === 0 ? currentLevel : LEVELS[found - 1];
};
