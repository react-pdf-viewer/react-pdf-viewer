import React, { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import StoreProps from './StoreProps';

const CurrentPageLabel: React.FC<{
    store: Store<StoreProps>
}> = ({ store }) => {
    const [currentPage, setCurrentPage] = useState<number>(0);

    const handleCurrentPage: StoreHandler<number> = (p: number) => setCurrentPage(p);

    useEffect(() => {    
        store.subscribe('currentPage', handleCurrentPage);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPage);
        };
    }, []);

    return (
        <div>{currentPage + 1}</div>
    );
};

export default CurrentPageLabel;
