/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement, useMemo } from 'react';
import { createStore, OpenFile, Plugin, ViewerState } from '@react-pdf-viewer/core';

import Download, { DownloadProps } from './Download';
import DownloadButton from './DownloadButton';
import getFileName from './getFileName';

import StoreProps from './StoreProps';

interface GetFilePlugin extends Plugin {
    Download: (props: DownloadProps) => ReactElement;
    DownloadButton: () => ReactElement;
}

export interface GetFilePluginProps {
    // Custom the download file name
    fileNameGenerator?: (file: OpenFile) => string;
}

const getFilePlugin = (props?: GetFilePluginProps): GetFilePlugin => {
    const store = useMemo(() => createStore<StoreProps>({}), []);

    const defaultFileNameGenerator = (file: OpenFile) => getFileName(file.name);

    const DownloadDecorator = (downloadProps: DownloadProps) => (
        <Download
            {...downloadProps}
            fileNameGenerator={props ? (props.fileNameGenerator || defaultFileNameGenerator) : defaultFileNameGenerator}
            store={store}
        />
    );

    const DownloadButtonDecorator = () => (
        <DownloadDecorator>
            { (props) => <DownloadButton {...props} /> }
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

export default getFilePlugin;
