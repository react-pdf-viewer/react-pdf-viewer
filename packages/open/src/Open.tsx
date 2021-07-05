/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import OpenButton from './OpenButton';
import StoreProps from './StoreProps';

export interface RenderOpenProps {
    onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type RenderOpen = (props: RenderOpenProps) => React.ReactElement;

export interface OpenProps {
    children?: RenderOpen;
}

const Open: React.FC<{
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

    const defaultChildren = (props: RenderOpenProps) => <OpenButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: handleOpenFiles,
    });
};

export default Open;
