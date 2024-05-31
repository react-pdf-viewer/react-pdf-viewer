/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const classNames = (classes: { [clazz: string]: boolean }): string => {
    const result: string[] = [];

    Object.keys(classes).forEach((clazz) => {
        if (clazz && classes[clazz]) {
            result.push(clazz);
        }
    });

    return result.join(' ');
};
