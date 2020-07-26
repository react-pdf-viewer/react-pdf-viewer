/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement } from 'react';
import { Store } from '@phuocng/rpv';

import RotateButton from './RotateButton';
import RotateDirection from './RotateDirection';
import StoreProps from './StoreProps';
import useRotation from './useRotation';

export interface RenderRotateProps {
    direction: RotateDirection;
    onClick(): void;
}

type RenderRotate = (props: RenderRotateProps) => ReactElement;

export interface RotateProps {
    children?: RenderRotate;
    direction: RotateDirection;
}

const Rotate: FC<{
    children?: RenderRotate,
    direction: RotateDirection,
    store: Store<StoreProps>,
}> = ({ children, direction, store }) => {
    const { rotation } = useRotation(store);

    const onClick = () => {
        const rotate = store.get('rotate');
        if (rotate) {
            const degrees = direction === RotateDirection.Backward ? -90 : 90;
            const updateRotation = (rotation === 360 || rotation === -360) ? degrees : rotation + degrees;
            rotate(updateRotation);
        }
    };

    const defaultChildren = (props: RenderRotateProps) => <RotateButton direction={props.direction} onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        direction,
        onClick,
    });
};

export default Rotate;
