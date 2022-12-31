/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const isMac = () => (typeof window !== 'undefined' ? /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) : false);
