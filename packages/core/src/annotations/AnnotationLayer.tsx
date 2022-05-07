/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import { AnnotationLayerBody } from './AnnotationLayerBody';
import { AnnotationLoader } from './AnnotationLoader';

export const AnnotationLayer: React.FC<{
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
}> = ({ doc, page, pageIndex, plugins, rotation, scale, onExecuteNamedAction, onJumpToDest }) => {
    const renderAnnotations = (annotations: PdfJs.Annotation[]): React.ReactElement => (
        <AnnotationLayerBody
            annotations={annotations}
            doc={doc}
            page={page}
            pageIndex={pageIndex}
            plugins={plugins}
            rotation={rotation}
            scale={scale}
            onExecuteNamedAction={onExecuteNamedAction}
            onJumpToDest={onJumpToDest}
        />
    );

    return <AnnotationLoader page={page} renderAnnotations={renderAnnotations} />;
};
