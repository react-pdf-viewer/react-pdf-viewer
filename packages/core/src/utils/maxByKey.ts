/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const maxByKey = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): T =>
    arr.reduce((a, b) => (a[key] >= b[key] ? a : b), {} as T);
