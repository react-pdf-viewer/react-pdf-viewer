/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@react-pdf-viewer/core';

import ScrollMode from './ScrollMode';
import StoreProps from './StoreProps';

interface UseScrollMode {
    scrollMode: ScrollMode;
    switchTo: (newScrollMode: ScrollMode) => void;
}

const useScrollMode = (store: Store<StoreProps>): UseScrollMode => {
    const [scrollMode, setScrollMode] = useState(
        store.get('scrollMode') || ScrollMode.Vertical
    );

    const switchTo = (newScrollMode: ScrollMode) => {
        const pagesRef = store.get('getPagesRef');
        if (!pagesRef) {
            return;
        }
        const pagesEle = pagesRef().current;
        if (!pagesEle) {
            return;
        }
        switch (newScrollMode) {
            case ScrollMode.Vertical:
                pagesEle.classList.add('rpv-scroll-mode-vertical');
                pagesEle.classList.remove('rpv-scroll-mode-horizontal');
                pagesEle.classList.remove('rpv-scroll-mode-wrapped');
                break;

            case ScrollMode.Horizontal:
                pagesEle.classList.add('rpv-scroll-mode-horizontal');
                pagesEle.classList.remove('rpv-scroll-mode-vertical');
                pagesEle.classList.remove('rpv-scroll-mode-wrapped');
                break;

            case ScrollMode.Wrapped:
                pagesEle.classList.add('rpv-scroll-mode-wrapped');
                pagesEle.classList.remove('rpv-scroll-mode-vertical');
                pagesEle.classList.remove('rpv-scroll-mode-horizontal');
                break;

            default:
                break;
        }

        store.update('scrollMode', newScrollMode);
    };

    const handleScrollModeChanged: StoreHandler<ScrollMode> = (
        newScrollMode: ScrollMode
    ) => {
        setScrollMode(newScrollMode);
    };

    useEffect(() => {
        store.subscribe('scrollMode', handleScrollModeChanged);

        return () => {
            store.unsubscribe('scrollMode', handleScrollModeChanged);
        };
    }, []);

    return { scrollMode, switchTo };
};

export default useScrollMode;
