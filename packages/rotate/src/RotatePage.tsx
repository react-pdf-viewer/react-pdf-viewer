/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import { RotateDirection } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { RenderRotatePageProps } from './types/RenderRotatePageProps';
import type { StoreProps } from './types/StoreProps';

type RenderRotatePage = (props: RenderRotatePageProps) => React.ReactElement;

export interface RotatePageProps {
    children: RenderRotatePage;
}

export const RotatePage: React.FC<{
    children: RenderRotatePage;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const onRotatePage = (pageIndex: number, direction: RotateDirection) => {
        const rotatePage = store.get('rotatePage');
        if (rotatePage) {
            rotatePage(pageIndex, direction);
        }
    };

    return children({
        onRotatePage,
    });
};
