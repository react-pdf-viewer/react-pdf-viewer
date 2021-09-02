/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { OpenButton } from './OpenButton';
import type { RenderOpenProps } from './types/RenderOpenProps';
import type { StoreProps } from './types/StoreProps';

type RenderOpen = (props: RenderOpenProps) => React.ReactElement;

export interface OpenProps {
    children?: RenderOpen;
}

export const Open: React.FC<{
    children?: RenderOpen;
    store: Store<StoreProps>;
}> = ({ store, children }) => {
    const handleOpenFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (!files || !files.length) {
            return;
        }
        const openFile = store.get('openFile');
        if (openFile) {
            openFile(files[0]);
        }
    };

    const defaultChildren = (props: RenderOpenProps) => <OpenButton store={store} onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: handleOpenFiles,
    });
};
