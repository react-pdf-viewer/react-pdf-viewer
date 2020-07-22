/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import StoreProps from './StoreProps';

const useNumberOfPages = (store: Store<StoreProps>) => {
    const [numberOfPages, setNumberOfPages] = useState(0);

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
