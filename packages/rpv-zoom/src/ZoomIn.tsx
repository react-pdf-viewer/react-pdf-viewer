/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { FC, ReactElement, useEffect, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import StoreProps from './StoreProps';
import { increase } from './zoomingLevel';

export interface RenderZoomInProps {
    onClick: () => void;
}

export interface ZoomInProps {
    children: RenderZoomIn;
}

type RenderZoomIn = (props: RenderZoomInProps) => ReactElement;

const ZoomIn: FC<{
    children: RenderZoomIn,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
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

    const zoomIn = () => {
        const zoom = store.get('zoom');
        if (zoom) {
            const newLevel = increase(scale);
            zoom(newLevel);
        }
    };

    return children({
        onClick: zoomIn,
    });
};

export default ZoomIn;
