/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Destination } from '../types/Destination';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import { AnnotationLayerBody } from './AnnotationLayerBody';
import { AnnotationLoader } from './AnnotationLoader';

export const AnnotationLayer: React.FC<{
    doc: PdfJs.PdfDocument;
    outlines: PdfJs.Outline[];
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    onExecuteNamedAction(action: string): void;
    onJumpFromLinkAnnotation(destination: Destination): void;
    onJumpToDest(destination: Destination): void;
}> = ({
    doc,
    outlines,
    page,
    pageIndex,
    plugins,
    rotation,
    scale,
    onExecuteNamedAction,
    onJumpFromLinkAnnotation,
    onJumpToDest,
}) => {
    const renderAnnotations = (annotations: PdfJs.Annotation[]): React.ReactElement => (
        <AnnotationLayerBody
            annotations={annotations}
            doc={doc}
            outlines={outlines}
            page={page}
            pageIndex={pageIndex}
            plugins={plugins}
            rotation={rotation}
            scale={scale}
            onExecuteNamedAction={onExecuteNamedAction}
            onJumpFromLinkAnnotation={onJumpFromLinkAnnotation}
            onJumpToDest={onJumpToDest}
        />
    );

    return <AnnotationLoader page={page} renderAnnotations={renderAnnotations} />;
};
