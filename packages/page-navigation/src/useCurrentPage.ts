/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store, StoreHandler } from '@react-pdf-viewer/core';
import { useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { StoreProps } from './types/StoreProps';

export const useCurrentPage = (store: Store<StoreProps>): { currentPage: number } => {
    const [currentPage, setCurrentPage] = React.useState(store.get('currentPage') || 0);

    const handleCurrentPageChanged: StoreHandler<number> = (currentPageIndex: number) => {
        setCurrentPage(currentPageIndex);
    };

    useIsomorphicLayoutEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
        };
    }, []);

    return { currentPage };
};
