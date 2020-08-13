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

const useRotation = (store: Store<StoreProps>): { rotation: number } => {
    const [rotation, setRotation] = useState(store.get('rotation') || 0);

    const handleRotationChanged: StoreHandler<number> = (currentRotation: number) => {
        setRotation(currentRotation);
    };

    useEffect(() => {
        store.subscribe('rotation', handleRotationChanged);

        return () => {
            store.unsubscribe('rotation', handleRotationChanged);
        };
    }, []);

    return { rotation };
};

export default useRotation;
