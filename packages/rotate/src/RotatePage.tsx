/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { RotateDirection, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type RenderRotatePageProps } from './types/RenderRotatePageProps';
import { type StoreProps } from './types/StoreProps';

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
