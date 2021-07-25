/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';
import type { OpenFile, Plugin, ViewerState } from '@react-pdf-viewer/core';

import { Download, DownloadProps } from './Download';
import { DownloadButton } from './DownloadButton';
import { DownloadMenuItem, DownloadMenuItemProps } from './DownloadMenuItem';
import { getFileName } from './getFileName';
import type { StoreProps } from './types/StoreProps';

// Export types
export type { DownloadMenuItemProps, DownloadProps };

export interface GetFilePlugin extends Plugin {
    Download: (props: DownloadProps) => React.ReactElement;
    DownloadButton: () => React.ReactElement;
    DownloadMenuItem: (props: DownloadMenuItemProps) => React.ReactElement;
}

export interface GetFilePluginProps {
    // Custom the download file name
    fileNameGenerator?: (file: OpenFile) => string;
}

export const getFilePlugin = (props?: GetFilePluginProps): GetFilePlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const defaultFileNameGenerator = (file: OpenFile) =>
        typeof file.data === 'object' ? 'document.pdf' : getFileName(file.name);

    const DownloadDecorator = (downloadProps: DownloadProps) => (
        <Download
            {...downloadProps}
            fileNameGenerator={props ? props.fileNameGenerator || defaultFileNameGenerator : defaultFileNameGenerator}
            store={store}
        />
    );

    const DownloadButtonDecorator = () => (
        <DownloadDecorator>{(props) => <DownloadButton {...props} />}</DownloadDecorator>
    );

    const DownloadMenuItemDecorator = (props: DownloadMenuItemProps) => (
        <DownloadDecorator>
            {(p) => (
                <DownloadMenuItem
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </DownloadDecorator>
    );

    return {
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('file', viewerState.file);
            return viewerState;
        },
        Download: DownloadDecorator,
        DownloadButton: DownloadButtonDecorator,
        DownloadMenuItem: DownloadMenuItemDecorator,
    };
};
