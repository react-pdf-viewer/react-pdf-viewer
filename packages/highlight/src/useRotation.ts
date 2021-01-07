/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store, StoreHandler } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';

const useRotation = (store: Store<StoreProps>): { rotation: number } => {
    const [rotation, setRotation] = React.useState(store.get('rotation') || 0);

    const handleRotationChanged: StoreHandler<number> = (
        currentRotation: number
    ) => setRotation(currentRotation);

    React.useEffect(() => {
        store.subscribe('rotation', handleRotationChanged);

        return () => {
            store.unsubscribe('rotation', handleRotationChanged);
        };
    }, []);

    return { rotation };
};

export default useRotation;
