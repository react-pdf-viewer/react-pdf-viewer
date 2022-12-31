/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { OpenFile, PdfJs, Store, StoreHandler } from '@react-pdf-viewer/core';
import * as React from 'react';
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
    const [currentDocument, setCurrentDocument] = React.useState<PdfJs.PdfDocument>(store.get('doc'));

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDocument(doc);
    };

    const handleFileChanged: StoreHandler<OpenFile> = (file: OpenFile) => {
        setCurrentFile(file);
    };

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);
        store.subscribe('file', handleFileChanged);

        return () => {
            store.subscribe('doc', handleDocumentChanged);
            store.unsubscribe('file', handleFileChanged);
        };
    }, []);

    const download = () => {
        if (currentDocument && currentFile) {
            downloadFile(currentDocument, fileNameGenerator(currentFile));
        }
    };

    const defaultChildren = (props: RenderDownloadProps) => <DownloadButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: download,
    });
};
