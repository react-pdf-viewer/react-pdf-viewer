/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, ViewerState } from '@phuocng/rpv';

import Download, { DownloadProps } from './Download';
import DownloadButton from './DownloadButton';

import StoreProps from './StoreProps';

interface DownloadPlugin extends Plugin {
    Download: (props: DownloadProps) => ReactElement;
    DownloadButton: () => ReactElement;
}

const downloadPlugin = (): DownloadPlugin => {
    const store = createStore<StoreProps>({});

    const DownloadDecorator = (props: DownloadProps) => (
        <Download {...props} store={store} />
    );

    const DownloadButtonDecorator = () => (
        <DownloadDecorator>
            {
                (props) => <DownloadButton {...props} />
            }
        </DownloadDecorator>
    );

    return {
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('file', viewerState.file);
            return viewerState;
        },
        Download: DownloadDecorator,
        DownloadButton: DownloadButtonDecorator,
    };
};

export default downloadPlugin;
