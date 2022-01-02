/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import type { PdfJs } from './PdfJs';
import type { Slot } from './Slot';

export interface RenderPageProps {
    annotationLayer: Slot;
    canvasLayer: Slot;
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    rotation: number;
    scale: number;
    svgLayer: Slot;
    textLayer: Slot;
    width: number;
}

export type RenderPage = (props: RenderPageProps) => React.ReactElement;
