/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { ZoomPopover } from './ZoomPopover';
import { type RenderZoomProps } from './types/RenderZoomProps';
import { type StoreProps } from './types/StoreProps';
import { useZoom } from './useZoom';

type RenderZoom = (props: RenderZoomProps) => React.ReactElement;

export interface ZoomProps {
    children?: RenderZoom;
    levels?: number[];
}

export const Zoom: React.FC<{
    children?: RenderZoom;
    levels?: number[];
    store: Store<StoreProps>;
}> = ({ children, levels, store }) => {
    const { scale } = useZoom(store);

    const zoomTo = (newLevel: number | SpecialZoomLevel) => {
        const zoom = store.get('zoom');
        if (zoom) {
            zoom(newLevel);
        }
    };

    const defaultChildren = (props: RenderZoomProps) => (
        <ZoomPopover levels={levels} scale={props.scale} onZoom={props.onZoom} />
    );
    const render = children || defaultChildren;

    return render({
        scale,
        onZoom: zoomTo,
    });
};
