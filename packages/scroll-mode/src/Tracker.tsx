/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core/lib';

import ScrollMode from './ScrollMode';
import StoreProps from './StoreProps';
import useScrollMode from './useScrollMode';

const Tracker: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const { switchTo } = useScrollMode(store);

    const handlePagesContainer = (getPagesContainer: () => HTMLElement) => {
        const pagesEle = getPagesContainer();
        if (!pagesEle) {
            return;
        }
        const scrollMode = store.get('scrollMode') || ScrollMode.Vertical;
        if (scrollMode !== ScrollMode.Vertical) {
            switchTo(scrollMode);
        }
    };

    React.useEffect(() => {
        store.subscribe('getPagesContainer', handlePagesContainer);

        return (): void => {
            store.unsubscribe('getPagesContainer', handlePagesContainer);
        };
    }, []);

    return <></>;
};

export default Tracker;
