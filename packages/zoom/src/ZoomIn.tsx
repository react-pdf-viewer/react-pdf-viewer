/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core/lib';

import StoreProps from './StoreProps';
import useZoom from './useZoom';
import ZoomInButton from './ZoomInButton';
import { increase } from './zoomingLevel';

export interface RenderZoomInProps {
    enableShortcuts: boolean;
    onClick: () => void;
}

type RenderZoomIn = (props: RenderZoomInProps) => React.ReactElement;

export interface ZoomInProps {
    children?: RenderZoomIn;
}

const ZoomIn: React.FC<{
    children?: RenderZoomIn;
    enableShortcuts: boolean;
    store: Store<StoreProps>;
}> = ({ children, enableShortcuts, store }) => {
    const { scale } = useZoom(store);

    const zoomIn = () => {
        const zoom = store.get('zoom');
        if (zoom) {
            const newLevel = increase(scale);
            zoom(newLevel);
        }
    };

    const render = children || ZoomInButton;

    return render({
        enableShortcuts,
        onClick: zoomIn,
    });
};

export default ZoomIn;
