/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Store } from '@phuocng/rpv';

import StoreProps from './StoreProps';
import useZoom from './useZoom';
import { decrease } from './zoomingLevel';
import ZoomOutButton from './ZoomOutButton';

export interface RenderZoomOutProps {
    onClick: () => void;
}

type RenderZoomOut = (props: RenderZoomOutProps) => React.ReactElement;

export interface ZoomOutProps {
    children?: RenderZoomOut;
}

const ZoomOut: React.FC<{
    children?: RenderZoomOut,
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

    const defaultChildren = (props: RenderZoomOutProps) => <ZoomOutButton onClick={props.onClick} />
    const render = children || defaultChildren;

    return render({
        onClick: zoomIn,
    });
};

export default ZoomOut;
