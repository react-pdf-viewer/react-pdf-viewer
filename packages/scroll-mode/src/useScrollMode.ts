/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollMode, type Store, type StoreHandler } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';

export const useScrollMode = (
    store: Store<StoreProps>,
): {
    scrollMode: ScrollMode;
} => {
    const [scrollMode, setScrollMode] = React.useState(store.get('scrollMode') || ScrollMode.Vertical);

    const handleScrollModeChanged: StoreHandler<ScrollMode> = (currentScrollMode: ScrollMode) => {
        setScrollMode(currentScrollMode);
    };

    React.useEffect(() => {
        store.subscribe('scrollMode', handleScrollModeChanged);

        return (): void => {
            store.unsubscribe('scrollMode', handleScrollModeChanged);
        };
    }, []);

    return { scrollMode };
};
