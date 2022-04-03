/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { RotateDirection } from './structs/RotateDirection';
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
            const degrees = direction === RotateDirection.Backward ? -90 : 90;
            rotatePage(pageIndex, degrees);
        }
    };

    return children({
        onRotatePage,
    });
};
