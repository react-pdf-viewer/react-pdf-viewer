/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { useZoom } from './useZoom';
import { ZoomInButton } from './ZoomInButton';
import { increase } from './zoomingLevel';
import type { RenderZoomInProps } from './types/RenderZoomInProps';
import type { StoreProps } from './types/StoreProps';

type RenderZoomIn = (props: RenderZoomInProps) => React.ReactElement;

export interface ZoomInProps {
    children?: RenderZoomIn;
}

export const ZoomIn: React.FC<{
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
