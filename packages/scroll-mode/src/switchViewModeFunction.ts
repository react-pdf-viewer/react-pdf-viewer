/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollMode, ViewMode, type Store } from '@react-pdf-viewer/core';
import { type StoreProps } from './types/StoreProps';

export const switchViewMode = (store: Store<StoreProps>, viewMode: ViewMode) => {
    store.get('switchViewMode')(viewMode);
    // Get the current scroll mode
    const currentScrollMode = store.get('scrollMode');
    if (
        (currentScrollMode === ScrollMode.Horizontal || currentScrollMode === ScrollMode.Wrapped) &&
        viewMode !== ViewMode.SinglePage
    ) {
        store.get('switchScrollMode')(ScrollMode.Vertical);
    }
};
