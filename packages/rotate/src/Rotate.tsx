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
import { RotateButton } from './RotateButton';
import { type RenderRotateProps } from './types/RenderRotateProps';
import { type StoreProps } from './types/StoreProps';

type RenderRotate = (props: RenderRotateProps) => React.ReactElement;

export interface RotateProps {
    children?: RenderRotate;
    direction: RotateDirection;
}

export const Rotate: React.FC<{
    children?: RenderRotate;
    direction: RotateDirection;
    store: Store<StoreProps>;
}> = ({ children, direction, store }) => {
    const onClick = () => {
        const rotate = store.get('rotate');
        if (rotate) {
            rotate(direction);
        }
    };

    const defaultChildren = (props: RenderRotateProps) => (
        <RotateButton direction={props.direction} onClick={props.onClick} />
    );
    const render = children || defaultChildren;

    return render({
        direction,
        onClick,
    });
};
