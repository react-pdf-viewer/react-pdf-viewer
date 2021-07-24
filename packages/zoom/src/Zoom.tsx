/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import { useZoom } from './useZoom';
import { ZoomPopover } from './ZoomPopover';
import type { RenderZoomProps } from './types/RenderZoomProps';
import type { StoreProps } from './types/StoreProps';

type RenderZoom = (props: RenderZoomProps) => React.ReactElement;

export interface ZoomProps {
    children?: RenderZoom;
}

export const Zoom: React.FC<{
    children?: RenderZoom;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { scale } = useZoom(store);

    const zoomTo = (newLevel: number | SpecialZoomLevel) => {
        const zoom = store.get('zoom');
        if (zoom) {
            zoom(newLevel);
        }
    };

    const defaultChildren = (props: RenderZoomProps) => <ZoomPopover scale={props.scale} onZoom={props.onZoom} />;
    const render = children || defaultChildren;

    return render({
        scale,
        onZoom: zoomTo,
    });
};
