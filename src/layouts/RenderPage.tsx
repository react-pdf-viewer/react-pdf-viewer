/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../vendors/PdfJs';
import Slot from './Slot';

interface RenderPageProps {
    annotationLayer: Slot;
    canvasLayer: Slot;
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    rotation: number;
    scale: number;
    textLayer: Slot;
    width: number;
}

type RenderPageType = (props: RenderPageProps) => React.ReactElement;

export default RenderPageProps;
export type RenderPage = RenderPageType;
