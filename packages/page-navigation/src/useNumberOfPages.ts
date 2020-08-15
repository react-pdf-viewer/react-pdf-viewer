/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';

const useNumberOfPages = (store: Store<StoreProps>): { numberOfPages: number } => {
    // It's safer to set the initial state from `store.get('numberOfPages')` instead of `0`.
    // There's a case that a component is loaded within a portal
    // so the hook `useEffect` usage below isn't triggered
    const [numberOfPages, setNumberOfPages] = useState(store.get('numberOfPages') || 0);

    const handleNumberOfPages: StoreHandler<number> = (total: number) => {
        setNumberOfPages(total);
    };

    useEffect(() => {
        store.subscribe('numberOfPages', handleNumberOfPages);

        return () => {
            store.unsubscribe('numberOfPages', handleNumberOfPages);
        };
    }, []);

    return { numberOfPages };
};

export default useNumberOfPages;
