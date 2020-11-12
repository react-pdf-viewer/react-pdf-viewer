/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useLayoutEffect, useState } from 'react';
import { Store, StoreHandler } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';

const useCurrentPage = (store: Store<StoreProps>): { currentPage: number } => {
    const [currentPage, setCurrentPage] = useState(
        store.get('currentPage') || 0
    );

    const handleCurrentPageChanged: StoreHandler<number> = (
        currentPageIndex: number
    ) => {
        setCurrentPage(currentPageIndex);
    };

    useLayoutEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
        };
    }, []);

    return { currentPage };
};

export default useCurrentPage;
