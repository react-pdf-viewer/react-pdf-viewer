/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const maxByKey = <T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): T =>
    arr.reduce((a, b) => (a[key] >= b[key] ? a : b), {} as T);
