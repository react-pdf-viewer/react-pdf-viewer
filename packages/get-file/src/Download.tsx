/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { OpenFile, Store, StoreHandler } from '@react-pdf-viewer/core';

import { DownloadButton } from './DownloadButton';
import { downloadFile } from './downloadFile';
import type { RenderDownloadProps } from './types/RenderDownloadProps';
import type { StoreProps } from './types/StoreProps';

export type RenderDownload = (props: RenderDownloadProps) => React.ReactElement;

export interface DownloadProps {
    children?: RenderDownload;
}

export const Download: React.FC<{
    children?: RenderDownload;
    fileNameGenerator: (file: OpenFile) => string;
    store: Store<StoreProps>;
}> = ({ children, fileNameGenerator, store }) => {
    const [currentFile, setCurrentFile] = React.useState<OpenFile>(store.get('file'));

    const handleFileChanged: StoreHandler<OpenFile> = (file: OpenFile) => {
        setCurrentFile(file);
    };

    React.useEffect(() => {
        store.subscribe('file', handleFileChanged);

        return () => {
            store.unsubscribe('file', handleFileChanged);
        };
    }, []);

    const download = () => {
        if (currentFile) {
            downloadFile(currentFile, fileNameGenerator(currentFile));
        }
    };

    const defaultChildren = (props: RenderDownloadProps) => <DownloadButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: download,
    });
};
