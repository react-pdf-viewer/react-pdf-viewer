/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store, StoreHandler } from '@react-pdf-viewer/core/lib';

import StoreProps from './StoreProps';

const useZoom = (store: Store<StoreProps>): { scale: number } => {
    const [scale, setScale] = React.useState(store.get('scale') || 0);

    const handleScaleChanged: StoreHandler<number> = (currentScale: number) => {
        setScale(currentScale);
    };

    React.useEffect(() => {
        store.subscribe('scale', handleScaleChanged);

        return () => {
            store.unsubscribe('scale', handleScaleChanged);
        };
    }, []);

    return { scale };
};

export default useZoom;
