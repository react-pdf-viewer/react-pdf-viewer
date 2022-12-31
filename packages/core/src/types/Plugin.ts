/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LayerRenderStatus } from '../structs/LayerRenderStatus';
import type { OpenFile } from './OpenFile';
import type { PdfJs } from './PdfJs';
import type { PluginFunctions } from './PluginFunctions';
import type { RenderViewer } from './RenderViewer';
import type { Slot } from './Slot';
import type { ViewerState } from './ViewerState';

export interface PluginOnDocumentLoad {
    doc: PdfJs.PdfDocument;
    file: OpenFile;
}

export interface PluginOnTextLayerRender {
    ele: HTMLElement;
    pageIndex: number;
    scale: number;
    status: LayerRenderStatus;
}

export interface PluginOnAnnotationLayerRender {
    annotations: PdfJs.Annotation[];
    container: HTMLElement;
    pageIndex: number;
    scale: number;
    rotation: number;
}

export interface PluginOnCanvasLayerRender {
    ele: HTMLCanvasElement;
    pageIndex: number;
    rotation: number;
    scale: number;
    status: LayerRenderStatus;
}

export interface PluginRenderPageLayer {
    canvasLayerRef: React.MutableRefObject<HTMLCanvasElement>;
    // Is the canvas layer rendered completely?
    canvasLayerRendered: boolean;
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    rotation: number;
    scale: number;
    textLayerRef: React.MutableRefObject<HTMLDivElement>;
    // Is the text layer rendered completely?
    textLayerRendered: boolean;
    width: number;
}

export interface Plugin {
    install?(pluginFunctions: PluginFunctions): void;
    renderPageLayer?(props: PluginRenderPageLayer): React.ReactElement;
    renderViewer?(props: RenderViewer): Slot;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onAnnotationLayerRender?(props: PluginOnAnnotationLayerRender): void;
    onCanvasLayerRender?(props: PluginOnCanvasLayerRender): void;
    onDocumentLoad?(props: PluginOnDocumentLoad): void;
    onTextLayerRender?(props: PluginOnTextLayerRender): void;
    onViewerStateChange?(viewerState: ViewerState): ViewerState;
}
