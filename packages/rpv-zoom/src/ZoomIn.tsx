/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { Store } from '@phuocng/rpv';

import StoreProps from './StoreProps';
import useZoom from './useZoom';
import ZoomInButton from './ZoomInButton';
import { increase } from './zoomingLevel';

export interface RenderZoomInProps {
    onClick: () => void;
}

type RenderZoomIn = (props: RenderZoomInProps) => ReactElement;

export interface ZoomInProps {
    children?: RenderZoomIn;
}

const ZoomIn: React.FC<{
    children?: RenderZoomIn,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { scale } = useZoom(store);

    const zoomIn = () => {
        const zoom = store.get('zoom');
        if (zoom) {
            const newLevel = increase(scale);
            zoom(newLevel);
        }
    };

    const defaultChildren = (props: RenderZoomInProps) => <ZoomInButton onClick={props.onClick} />
    const render = children || defaultChildren;

    return render({
        onClick: zoomIn,
    });
};

export default ZoomIn;
