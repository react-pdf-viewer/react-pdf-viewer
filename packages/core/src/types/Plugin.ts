/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { PdfJs } from '../vendors/PdfJs';
import { LayerRenderStatus } from '../struct/LayerRenderStatus';
import type { PluginFunctions } from './PluginFunctions';
import type { RenderViewer } from './RenderViewer';
import type { Slot } from './Slot';
import type { ViewerState } from './ViewerState';

export interface PluginOnDocumentLoad {
    doc: PdfJs.PdfDocument;
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
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    rotation: number;
    scale: number;
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
