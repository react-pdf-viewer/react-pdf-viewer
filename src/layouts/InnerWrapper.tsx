/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useEffect, useRef, useState } from 'react';

import File from '../File';
import useDragScroll from '../hooks/useDragScroll';
import useDrop from '../hooks/useDrop';
import useFullScreen from '../hooks/useFullScreen';
import useToggle from '../hooks/useToggle';
import PageLayer from '../layers/PageLayer';
import DropArea from '../open/DropArea';
import Plugin from '../Plugin';
import PrintContainer from '../print/PrintContainer';
import PrintStatus from '../print/PrintStatus';
import Match from '../search/Match';
import ScrollMode from '../ScrollMode';
import SelectionMode from '../SelectionMode';
import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContext from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import downloadFile from '../utils/downloadFile';
import getFileExt from '../utils/fileExt';
import { CanvasLayerRenderEvent, DocumentLoadEvent, PageChangeEvent, RenderViewer, TextLayerRenderEvent, ZoomEvent } from '../Viewer';
import ExitFullScreen from './ExitFullScreen';
import Inner from './Inner';
import './inner.less';
import { Layout } from './Layout';
import PageSize from './PageSize';
import { RenderPage } from './RenderPage';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { RenderToolbarSlot } from './ToolbarSlot';
import ViewerState from 'src/ViewerState';

interface InnerWrapperProps {
    defaultScale?: number | SpecialZoomLevel;
    doc: PdfJs.PdfDocument;
    file: File;
    initialPage?: number;
    keyword?: string | RegExp;
    pageSize: PageSize;
    plugins: Plugin[];
    renderPage?: RenderPage;
    selectionMode: SelectionMode;
    viewerState: ViewerState;
    onCanvasLayerRender(e: CanvasLayerRenderEvent): void;
    onDocumentLoad(e: DocumentLoadEvent): void;
    onOpenFile(fileName: string, data: Uint8Array): void;
    onPageChange(e: PageChangeEvent): void;
    onTextLayerRender(e: TextLayerRenderEvent): void;
    onZoom(e: ZoomEvent): void;
}

const InnerWrapper: React.FC<InnerWrapperProps> = ({
    defaultScale, doc, file, initialPage, keyword, pageSize, plugins, renderPage, selectionMode, viewerState,
    onCanvasLayerRender, onDocumentLoad, onOpenFile, onPageChange, onTextLayerRender, onZoom,
}) => {
    const setViewerState = (newViewerState: ViewerState) => {

    };

    const getViewerState = () => viewerState;

    const getPluginMethods = () => ({
        setViewerState,
        getViewerState,
    });

    const createPluginHooks = () => {
        const pluginHooks = {};
        const eventHookKeys: string[] = [];

        plugins.forEach(plugin => {
            Object.keys(plugin).forEach(propName => {
                if (eventHookKeys.indexOf(propName) !== -1) {
                    return;
                }

                if (propName.startsWith('on')) {
                    eventHookKeys.push(propName);
                    return;
                }
            });
        });

        // eventHookKeys.forEach(propName => {
        //     pluginHooks[propName] = createEventHooks(propName, plugins);
        // });

        return pluginHooks;
    };

    useEffect(() => {
        const pluginMethods = getPluginMethods();

        // Install the plugins
        plugins.forEach((plugin) => {
            plugin.install(pluginMethods);
        });

        return () => {
            // Uninstall the plugins
            plugins.forEach((plugin) => {
                plugin.uninstall(pluginMethods);
            });
        };
    }, []);

    return (
        <Inner
            defaultScale={defaultScale}
            doc={doc}
            file={file}
            initialPage={initialPage}
            keyword={keyword}
            pageSize={pageSize}
            renderPage={renderPage}
            selectionMode={selectionMode}
            onCanvasLayerRender={onCanvasLayerRender}
            onDocumentLoad={onDocumentLoad}
            onOpenFile={onOpenFile}
            onPageChange={onPageChange}
            onTextLayerRender={onTextLayerRender}
            onZoom={onZoom}
        />
    );
};

export default InnerWrapper;
