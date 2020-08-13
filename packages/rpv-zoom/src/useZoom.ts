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

const useZoom = (store: Store<StoreProps>): { scale: number } => {
    const [scale, setScale] = useState(0);

    const handleScaleChanged: StoreHandler<number> = (currentScale: number) => {
        setScale(currentScale);
    };

    useEffect(() => {
        store.subscribe('scale', handleScaleChanged);

        return () => {
            store.unsubscribe('scale', handleScaleChanged);
        };
    }, []);

    return { scale };
};

export default useZoom;
