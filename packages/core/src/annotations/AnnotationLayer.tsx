/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import SpecialZoomLevel from '../SpecialZoomLevel';
import { Plugin } from '../types/Plugin';
import PdfJs from '../vendors/PdfJs';
import AnnotationLayerBody from './AnnotationLayerBody';
import AnnotationLoader from './AnnotationLoader';

interface AnnotationLayerProps {
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
    doc,
    page,
    pageIndex,
    plugins,
    rotation,
    scale,
    onExecuteNamedAction,
    onJumpToDest,
}) => {
    const containerRef = React.useRef<HTMLDivElement>();

    const renderAnnotations = (annotations: PdfJs.Annotation[]): React.ReactElement => {
        return (
            <AnnotationLayerBody
                annotations={annotations}
                containerRef={containerRef}
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
    };

    return (
        <div ref={containerRef} className="rpv-core__annotation-layer">
            <AnnotationLoader page={page} renderAnnotations={renderAnnotations} />
        </div>
    );
};

export default AnnotationLayer;
