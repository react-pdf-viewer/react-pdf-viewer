/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { RotateButton } from './RotateButton';
import { RotateDirection } from './structs/RotateDirection';
import { useRotation } from './useRotation';
import type { RenderRotateProps } from './types/RenderRotateProps';
import type { StoreProps } from './types/StoreProps';

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
    const { rotation } = useRotation(store);

    const onClick = () => {
        const rotate = store.get('rotate');
        if (rotate) {
            const degrees = direction === RotateDirection.Backward ? -90 : 90;
            const updateRotation = rotation === 360 || rotation === -360 ? degrees : rotation + degrees;
            rotate(updateRotation);
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
