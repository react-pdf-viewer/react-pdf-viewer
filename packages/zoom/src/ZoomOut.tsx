/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { useZoom } from './useZoom';
import { decrease } from './zoomingLevel';
import { ZoomOutButton } from './ZoomOutButton';
import type { RenderZoomOutProps } from './types/RenderZoomOutProps';
import type { StoreProps } from './types/StoreProps';

type RenderZoomOut = (props: RenderZoomOutProps) => React.ReactElement;

export interface ZoomOutProps {
    children?: RenderZoomOut;
}

export const ZoomOut: React.FC<{
    children?: RenderZoomOut;
    enableShortcuts: boolean;
    store: Store<StoreProps>;
}> = ({ children, enableShortcuts, store }) => {
    const { scale } = useZoom(store);

    const zoomIn = () => {
        const zoom = store.get('zoom');
        if (zoom) {
            const newLevel = decrease(scale);
            zoom(newLevel);
        }
    };

    const render = children || ZoomOutButton;

    return render({
        enableShortcuts,
        onClick: zoomIn,
    });
};
