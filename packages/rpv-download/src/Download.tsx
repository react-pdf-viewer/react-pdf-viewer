/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { OpenFile, Store, StoreHandler } from '@phuocng/rpv';

import DownloadButton from './DownloadButton';
import downloadFile from './downloadFile';
import StoreProps from './StoreProps';

export interface RenderDownloadProps {
    onClick: () => void;
}

export type RenderDownload = (props: RenderDownloadProps) => React.ReactElement;

export interface DownloadProps {
    children?: RenderDownload;
}

const Download: React.FC<{
    children?: RenderDownload,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const [currentFile, setCurrentFile] = useState<OpenFile>();

    const handleFileChanged: StoreHandler<OpenFile> = (file: OpenFile) => {
        setCurrentFile(file);
    };

    useEffect(() => {
        store.subscribe('file', handleFileChanged);

        return () => {
            store.unsubscribe('file', handleFileChanged);
        };
    }, []);

    const download = () => {
        if (currentFile) {
            downloadFile(currentFile.name, currentFile.data);
        }
    };

    const defaultChildren = (props: RenderDownloadProps) => <DownloadButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: download,
    });
};

export default Download;
