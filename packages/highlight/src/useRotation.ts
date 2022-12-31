/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store, StoreHandler } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { StoreProps } from './types/StoreProps';

export const useRotation = (store: Store<StoreProps>): { rotation: number } => {
    const [rotation, setRotation] = React.useState(store.get('rotation') || 0);

    const handleRotationChanged: StoreHandler<number> = (currentRotation: number) => setRotation(currentRotation);

    React.useEffect(() => {
        store.subscribe('rotation', handleRotationChanged);

        return () => {
            store.unsubscribe('rotation', handleRotationChanged);
        };
    }, []);

    return { rotation };
};
