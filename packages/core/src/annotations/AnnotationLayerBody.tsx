/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import styles from '../styles/annotationLayer.module.css';
import { type Destination } from '../types/Destination';
import { type PdfJs } from '../types/PdfJs';
import { type Plugin } from '../types/Plugin';
import { AnnotationType } from './AnnotationType';
import { Caret } from './Caret';
import { Circle } from './Circle';
import { FileAttachment } from './FileAttachment';
import { FreeText } from './FreeText';
import { Highlight } from './Highlight';
import { Ink } from './Ink';
import { Line } from './Line';
import { Link } from './Link';
import { Polygon } from './Polygon';
import { Polyline } from './Polyline';
import { Popup } from './Popup';
import { Square } from './Square';
import { Squiggly } from './Squiggly';
import { Stamp } from './Stamp';
import { StrikeOut } from './StrikeOut';
import { Text } from './Text';
import { Underline } from './Underline';

export const AnnotationLayerBody: React.FC<{
    annotations: PdfJs.Annotation[];
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
    annotations,
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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const viewport = page.getViewport({ rotation, scale });
    const clonedViewPort = viewport.clone({ dontFlip: true });

    const filterAnnotations = annotations.filter((annotation) => !annotation.parentId);

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const renderProps = {
            annotations: filterAnnotations,
            container,
            pageIndex,
            rotation,
            scale,
        };
        const handleRenderAnnotationLayer = (plugin: Plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => {
                    handleRenderAnnotationLayer(dep);
                });
            }
            if (plugin.onAnnotationLayerRender) {
                plugin.onAnnotationLayerRender(renderProps);
            }
        };

        plugins.forEach((plugin) => {
            handleRenderAnnotationLayer(plugin);
        });
    }, []);

    return (
        <div ref={containerRef} className={styles.layer} data-testid={`core__annotation-layer-${pageIndex}`}>
            {filterAnnotations.map((annotation) => {
                const childAnnotation = annotations.find((item) => item.parentId === annotation.id);
                switch (annotation.annotationType) {
                    case AnnotationType.Caret:
                        return (
                            <Caret key={annotation.id} annotation={annotation} page={page} viewport={clonedViewPort} />
                        );
                    case AnnotationType.Circle:
                        return (
                            <Circle key={annotation.id} annotation={annotation} page={page} viewport={clonedViewPort} />
                        );
                    case AnnotationType.FileAttachment:
                        return (
                            <FileAttachment
                                key={annotation.id}
                                annotation={annotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.FreeText:
                        return (
                            <FreeText
                                key={annotation.id}
                                annotation={annotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.Highlight:
                        return (
                            <Highlight
                                key={annotation.id}
                                annotation={annotation}
                                childAnnotation={childAnnotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.Ink:
                        return (
                            <Ink key={annotation.id} annotation={annotation} page={page} viewport={clonedViewPort} />
                        );
                    case AnnotationType.Line:
                        return (
                            <Line key={annotation.id} annotation={annotation} page={page} viewport={clonedViewPort} />
                        );
                    case AnnotationType.Link:
                        return (
                            <Link
                                key={annotation.id}
                                annotation={annotation}
                                annotationContainerRef={containerRef}
                                doc={doc}
                                outlines={outlines}
                                page={page}
                                pageIndex={pageIndex}
                                scale={scale}
                                viewport={clonedViewPort}
                                onExecuteNamedAction={onExecuteNamedAction}
                                onJumpFromLinkAnnotation={onJumpFromLinkAnnotation}
                                onJumpToDest={onJumpToDest}
                            />
                        );
                    case AnnotationType.Polygon:
                        return (
                            <Polygon
                                key={annotation.id}
                                annotation={annotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.Polyline:
                        return (
                            <Polyline
                                key={annotation.id}
                                annotation={annotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.Popup:
                        return (
                            <Popup key={annotation.id} annotation={annotation} page={page} viewport={clonedViewPort} />
                        );
                    case AnnotationType.Square:
                        return (
                            <Square key={annotation.id} annotation={annotation} page={page} viewport={clonedViewPort} />
                        );
                    case AnnotationType.Squiggly:
                        return (
                            <Squiggly
                                key={annotation.id}
                                annotation={annotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.Stamp:
                        return (
                            <Stamp key={annotation.id} annotation={annotation} page={page} viewport={clonedViewPort} />
                        );
                    case AnnotationType.StrikeOut:
                        return (
                            <StrikeOut
                                key={annotation.id}
                                annotation={annotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.Text:
                        return (
                            <Text
                                key={annotation.id}
                                annotation={annotation}
                                childAnnotation={childAnnotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    case AnnotationType.Underline:
                        return (
                            <Underline
                                key={annotation.id}
                                annotation={annotation}
                                page={page}
                                viewport={clonedViewPort}
                            />
                        );
                    default:
                        return <React.Fragment key={annotation.id}></React.Fragment>;
                }
            })}
        </div>
    );
};
