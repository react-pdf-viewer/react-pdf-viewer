/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store, StoreHandler } from '@react-pdf-viewer/core';

import { ScrollMode } from './structs/ScrollMode';
import type { StoreProps } from './types/StoreProps';

export const useScrollMode = (
    store: Store<StoreProps>
): {
    scrollMode: ScrollMode;
    switchTo: (newScrollMode: ScrollMode) => void;
} => {
    const [scrollMode, setScrollMode] = React.useState(store.get('scrollMode') || ScrollMode.Vertical);

    const switchTo = (newScrollMode: ScrollMode) => {
        const getPagesContainer = store.get('getPagesContainer');
        if (!getPagesContainer) {
            return;
        }
        const pagesEle = getPagesContainer();
        if (!pagesEle) {
            return;
        }
        switch (newScrollMode) {
            case ScrollMode.Vertical:
                pagesEle.classList.add('rpv-scroll-mode__vertical');
                pagesEle.classList.remove('rpv-scroll-mode__horizontal');
                pagesEle.classList.remove('rpv-scroll-mode__wrapped');
                break;

            case ScrollMode.Horizontal:
                pagesEle.classList.add('rpv-scroll-mode__horizontal');
                pagesEle.classList.remove('rpv-scroll-mode__vertical');
                pagesEle.classList.remove('rpv-scroll-mode__wrapped');
                break;

            case ScrollMode.Wrapped:
                pagesEle.classList.add('rpv-scroll-mode__wrapped');
                pagesEle.classList.remove('rpv-scroll-mode__vertical');
                pagesEle.classList.remove('rpv-scroll-mode__horizontal');
                break;

            default:
                break;
        }

        store.update('scrollMode', newScrollMode);
    };

    const handleScrollModeChanged: StoreHandler<ScrollMode> = (newScrollMode: ScrollMode) => {
        setScrollMode(newScrollMode);
    };

    React.useEffect(() => {
        store.subscribe('scrollMode', handleScrollModeChanged);

        return () => {
            store.unsubscribe('scrollMode', handleScrollModeChanged);
        };
    }, []);

    return { scrollMode, switchTo };
};
