/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store, StoreHandler } from '@react-pdf-viewer/core';
import { ViewMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { StoreProps } from './types/StoreProps';

export const useViewMode = (
    store: Store<StoreProps>
): {
    viewMode: ViewMode;
} => {
    const [viewMode, setViewMode] = React.useState(store.get('viewMode') || ViewMode.SinglePage);

    const handleViewModeChanged: StoreHandler<ViewMode> = (currentViewMode: ViewMode) => {
        setViewMode(currentViewMode);
    };

    React.useEffect(() => {
        store.subscribe('viewMode', handleViewModeChanged);

        return (): void => {
            store.unsubscribe('viewMode', handleViewModeChanged);
        };
    }, []);

    return { viewMode };
};
