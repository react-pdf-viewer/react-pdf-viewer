/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import { ScrollMode, ViewMode } from '@react-pdf-viewer/core';
import type { StoreProps } from './types/StoreProps';

export const switchScrollMode = (store: Store<StoreProps>, scrollMode: ScrollMode) => {
    store.get('switchScrollMode')(scrollMode);
    // Get the current viewmode
    const currentViewMode = store.get('viewMode');
    if (
        (scrollMode === ScrollMode.Horizontal || scrollMode === ScrollMode.Wrapped) &&
        currentViewMode !== ViewMode.SinglePage
    ) {
        store.get('switchViewMode')(ViewMode.SinglePage);
    }
};
