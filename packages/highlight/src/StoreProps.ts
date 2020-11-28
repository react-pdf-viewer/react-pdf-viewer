/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RefObject } from 'react';
import { SelectionState } from './SelectionState';

export default interface StoreProps {
    getPageElement?(pageIndex: number): HTMLElement | null;
    getPagesRef?(): RefObject<HTMLDivElement>;
    selectionState: SelectionState;
}
