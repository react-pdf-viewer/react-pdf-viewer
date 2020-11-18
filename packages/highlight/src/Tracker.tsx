/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, RefObject, useEffect, useRef, useState } from 'react';
import { Store } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';

const Tracker: FC<{
    store: Store<StoreProps>,
}> = ({ store }) => {
    const pagesRef = useRef<HTMLDivElement | null>(null);
    const [arePagesFound, setPagesFound] = useState(false);

    const handlePagesRef = (pagesRefFn: () => RefObject<HTMLDivElement>) => {
        const ele = pagesRefFn().current;
        pagesRef.current = ele;
        setPagesFound(!!ele);
    };

    const onMouseUpHandler = () => {
        
    };

    useEffect(() => {
        const ele = pagesRef.current;
        if (!ele) {
            return;
        }

        ele.addEventListener('mouseup', onMouseUpHandler);
        return (): void => {
            ele.removeEventListener('mouseup', onMouseUpHandler);
        };
    }, [arePagesFound]);

    useEffect(() => {
        store.subscribe('getPagesRef', handlePagesRef);

        return (): void => {
            store.unsubscribe('getPagesRef', handlePagesRef);
        };
    }, []);

    return <></>;
};

export default Tracker;
