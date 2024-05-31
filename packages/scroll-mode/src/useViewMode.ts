/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { ViewMode, type Store, type StoreHandler } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';

export const useViewMode = (
    store: Store<StoreProps>,
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
