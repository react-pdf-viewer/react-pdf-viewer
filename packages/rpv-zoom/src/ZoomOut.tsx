/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { FC, ReactElement } from 'react';
import { Store } from '@phuocng/rpv';

import StoreProps from './StoreProps';
import useZoom from './useZoom';
import { decrease } from './zoomingLevel';

export interface RenderZoomOutProps {
    onClick: () => void;
}

export interface ZoomOutProps {
    children: RenderZoomOut;
}

type RenderZoomOut = (props: RenderZoomOutProps) => ReactElement;

const ZoomOut: FC<{
    children: RenderZoomOut,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { scale } = useZoom(store);

    const zoomIn = () => {
        const zoom = store.get('zoom');
        if (zoom) {
            const newLevel = decrease(scale);
            zoom(newLevel);
        }
    };

    return children({
        onClick: zoomIn,
    });
};

export default ZoomOut;
