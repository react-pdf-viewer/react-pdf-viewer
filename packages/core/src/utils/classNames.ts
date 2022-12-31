/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
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
