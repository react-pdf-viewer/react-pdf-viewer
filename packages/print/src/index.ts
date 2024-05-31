/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

export { type PrintProps } from './Print';
export { PrintIcon } from './PrintIcon';
export { type PrintMenuItemProps } from './PrintMenuItem';
export { getAllPagesNumbers } from './getAllPagesNumbers';
export { getCustomPagesNumbers } from './getCustomPagesNumbers';
export { getEvenPagesNumbers } from './getEvenPagesNumbers';
export { getOddPagesNumbers } from './getOddPagesNumbers';
export * from './printPlugin';
export { type RenderPrintProps } from './types/RenderPrintProps';
