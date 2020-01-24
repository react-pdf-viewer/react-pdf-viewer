/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Slot from './layouts/Slot';
import defaultLayout from './layouts/defaultLayout';
import defaultToolbar from './layouts/defaultToolbar';
import { RenderToolbar } from './layouts/ToolbarSlot';
import DocumentLoader from './loader/DocumentLoader';
import LocalizationMap from './localization/LocalizationMap';
import LocalizationProvider from './localization/LocalizationProvider';
import PageSizeCalculator, { PageSize } from './PageSizeCalculator';
import PdfJs from './PdfJs';
import downloadFile from './utils/downloadFile';
import ViewerInner from './ViewerInner';

interface File {
    data: PdfJs.FileData;
    name: string;
}

interface ViewerProps {
    fileUrl: string;
    localization?: LocalizationMap;
    layout?: (isSidebarOpened: boolean,
        main: Slot,
        toolbar: RenderToolbar,
        sidebar: Slot,
    ) => React.ReactElement;
}

const Viewer: React.FC<ViewerProps> = ({ fileUrl, layout, localization }) => {
    const [file, setFile] = React.useState<File>({
        data: fileUrl,
        name: fileUrl,
    });
    const layoutOption = (
        isSidebarOpened: boolean,
        main: Slot,
        toolbar: RenderToolbar,
        sidebar: Slot,
    ): React.ReactElement => {
        return defaultLayout(
            isSidebarOpened,
            main,
            toolbar(defaultToolbar),
            sidebar
        );
    };

    const openFile = (fileName: string, data: Uint8Array) => {
        setFile({
            data,
            name: fileName,
        });
    };

    const download = () => {
        downloadFile(file.name, file.data);
    };

    const renderDoc = (doc: PdfJs.PdfDocument) => {
        const renderInner = (pageSize: PageSize) => (
            <ViewerInner
                doc={doc}
                fileName={file.name}
                layout={layout || layoutOption}
                pageSize={pageSize}
                onDownload={download}
                onOpenFile={openFile}
            />
        );
        return (
            <PageSizeCalculator
                doc={doc}
                render={renderInner}
            />
        );
    };

    return (
        <LocalizationProvider localization={localization}>
            <DocumentLoader
                file={file.data}
                render={renderDoc}
            />
        </LocalizationProvider>
    );
};

export default Viewer;
