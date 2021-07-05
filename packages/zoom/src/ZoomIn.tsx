/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import useZoom from './useZoom';
import ZoomInButton from './ZoomInButton';
import { increase } from './zoomingLevel';

export interface RenderZoomInProps {
    onClick: () => void;
}

type RenderZoomIn = (props: RenderZoomInProps) => React.ReactElement;

export interface ZoomInProps {
    children?: RenderZoomIn;
}

const ZoomIn: React.FC<{
    children?: RenderZoomIn;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { scale } = useZoom(store);

    const zoomIn = () => {
        const zoom = store.get('zoom');
        if (zoom) {
            const newLevel = increase(scale);
            zoom(newLevel);
        }
    };

    const defaultChildren = (props: RenderZoomInProps) => <ZoomInButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: zoomIn,
    });
};

export default ZoomIn;
