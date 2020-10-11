/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, RefObject, useEffect } from 'react';
import { Store } from '@react-pdf-viewer/core';

import ScrollMode from './ScrollMode';
import StoreProps from './StoreProps';
import useScrollMode from './useScrollMode';

const Tracker: FC<{
    store: Store<StoreProps>,
}> = ({ store }) => {
    const { switchTo } = useScrollMode(store);

    const handlePagesRef = (pagesRefFn: () => RefObject<HTMLDivElement>) => {
        const pagesEle = pagesRefFn().current;
        if (!pagesEle) {
            return;
        }
        const scrollMode = store.get('scrollMode') || ScrollMode.Vertical;
        if (scrollMode !== ScrollMode.Vertical) {
            switchTo(scrollMode);
        }
    };

    useEffect(() => {
        store.subscribe('getPagesRef', handlePagesRef);

        return (): void => {
            store.unsubscribe('getPagesRef', handlePagesRef);
        };
    }, []);

    return <></>;
};

export default Tracker;
