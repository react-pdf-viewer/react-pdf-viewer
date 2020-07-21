/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement } from 'react';
import { Store } from '@phuocng/rpv';

import StoreProps from './StoreProps';
import useZoom from './useZoom';

export interface RenderCurrentScaleProps {
    scale: number;
}

export interface CurrentScaleProps {
    children?: RenderCurrentScale;
}

type RenderCurrentScale = (props: RenderCurrentScaleProps) => ReactElement;

const CurrentScale: FC<{
    children?: RenderCurrentScale,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const { scale } = useZoom(store);

    const defaultChildren = (props: RenderCurrentScaleProps) => <>{`${Math.round(props.scale * 100)}%`}</>;
    const render = children || defaultChildren;

    return render({ scale });
};

export default CurrentScale;
