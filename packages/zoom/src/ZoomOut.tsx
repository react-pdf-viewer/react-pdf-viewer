/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { ZoomOutButton } from './ZoomOutButton';
import { type RenderZoomOutProps } from './types/RenderZoomOutProps';
import { type StoreProps } from './types/StoreProps';
import { useZoom } from './useZoom';
import { decrease } from './zoomingLevel';

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
