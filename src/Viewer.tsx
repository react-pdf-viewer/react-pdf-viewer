/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import File from './File';
import Slot from './layouts/Slot';
import defaultLayout from './layouts/defaultLayout';
import defaultToolbar from './layouts/defaultToolbar';
import Inner from './layouts/Inner';
import { Layout } from './layouts/Layout';
import PageSizeCalculator, { PageSize } from './layouts/PageSizeCalculator';
import { RenderPage } from './layouts/RenderPage';
import { RenderToolbar } from './layouts/ToolbarSlot';
import DocumentLoader, { RenderError } from './loader/DocumentLoader';
import LocalizationMap from './localization/LocalizationMap';
import LocalizationProvider from './localization/LocalizationProvider';
import ScrollMode from './ScrollMode';
import SelectionMode from './SelectionMode';
import SpecialZoomLevel from './SpecialZoomLevel';
import ThemeProvider from './theme/ThemeProvider';
import PdfJs from './vendors/PdfJs';

interface RenderViewerProps {
    viewer: React.ReactElement;
    doc: PdfJs.PdfDocument;
    download(): void;
    changeScrollMode(mode: ScrollMode): void;
    changeSelectionMode(mode: SelectionMode): void;
    jumpToPage(page: number): void;
    print(): void;
    rotate(degree: number): void;
    zoom(level: number | SpecialZoomLevel): void;
}

export type RenderViewer = (props: RenderViewerProps) => React.ReactElement;

interface ViewerProps {
    // The default zoom level
    // If it's not set, the initial zoom level will be calculated based on the dimesion of page and the container width
    defaultScale?: number | SpecialZoomLevel;
    fileUrl: string | Uint8Array;
    // The page (zero-index based) that will be displayed initially
    initialPage?: number;
    // The keyword that will be highlighted in all pages
    keyword?: string | RegExp;
    layout?: Layout;
    localization?: LocalizationMap;
    // The prefix for CSS classes
    prefixClass?: string;
    render?: RenderViewer;
    renderError?: RenderError;
    renderPage?: RenderPage;
    // The text selection mode
    selectionMode?: SelectionMode;
    onDocumentLoad?(doc: PdfJs.PdfDocument): void;
    onZoom?(doc: PdfJs.PdfDocument, scale: number): void;
}

const Viewer: React.FC<ViewerProps> = ({
    defaultScale,
    fileUrl,
    initialPage,
    keyword,
    layout,
    localization,
    prefixClass,
    render,
    renderError,
    renderPage,
    selectionMode = SelectionMode.Text,
    onDocumentLoad = () => {/**/},
    onZoom = () => {/**/},
}) => {
    const [file, setFile] = React.useState<File>({
        data: fileUrl,
        name: (typeof fileUrl === 'string') ? fileUrl : '',
    });
    const layoutOption = (
        isSidebarOpened: boolean,
        container: Slot,
        main: Slot,
        toolbar: RenderToolbar,
        sidebar: Slot,
    ): React.ReactElement => {
        return defaultLayout(
            isSidebarOpened,
            container,
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

    const renderDoc = (renderViewer: RenderViewer) => (doc: PdfJs.PdfDocument) => {
        const renderInner = (ps: PageSize) => {
            const pageSize = ps;

            return (
                <Inner
                    defaultScale={defaultScale}
                    doc={doc}
                    file={file}
                    initialPage={initialPage}
                    keyword={keyword}
                    layout={layout || layoutOption}
                    pageSize={pageSize}
                    render={renderViewer}
                    renderPage={renderPage}
                    selectionMode={selectionMode}
                    onDocumentLoad={onDocumentLoad}
                    onOpenFile={openFile}
                    onZoom={onZoom}
                />
            );
        };
        return (
            <PageSizeCalculator
                doc={doc}
                render={renderInner}
            />
        );
    };

    const defaultRenderer = render || (props => props.viewer);
    return (
        <ThemeProvider prefixClass={prefixClass}>
            <LocalizationProvider localization={localization}>
                <DocumentLoader
                    file={file.data}
                    render={renderDoc(defaultRenderer)}
                    renderError={renderError}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default Viewer;
