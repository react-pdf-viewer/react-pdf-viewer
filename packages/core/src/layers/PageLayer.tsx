/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { AnnotationLayer } from '../annotations/AnnotationLayer';
import { Spinner } from '../components/Spinner';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { getPage } from '../utils/managePages';
import { CanvasLayer } from './CanvasLayer';
import { SvgLayer } from './SvgLayer';
import { TextLayer } from './TextLayer';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import type { RenderPage, RenderPageProps } from '../types/RenderPage';
import type { VisibilityChanged } from '../types/VisibilityChanged';

interface PageSizeState {
    page?: PdfJs.Page | null;
    pageHeight: number;
    pageWidth: number;
    viewportRotation: number;
}

const INTERSECTION_THRESHOLD = Array(10)
    .fill(null)
    .map((_, i) => i / 10);

export const PageLayer: React.FC<{
    currentPage: number;
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    plugins: Plugin[];
    renderPage?: RenderPage;
    rotation: number;
    scale: number;
    shouldRender: boolean;
    width: number;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
    onPageVisibilityChanged(pageIndex: number, ratio: number): void;
    onRenderCompleted(pageIndex: number): void;
}> = ({
    currentPage,
    doc,
    height,
    pageIndex,
    plugins,
    renderPage,
    rotation,
    scale,
    shouldRender,
    width,
    onExecuteNamedAction,
    onJumpToDest,
    onPageVisibilityChanged,
    onRenderCompleted,
}) => {
    const [pageSize, setPageSize] = React.useState<PageSizeState>({
        page: null,
        pageHeight: height,
        pageWidth: width,
        viewportRotation: 0,
    });
    const { page, pageHeight, pageWidth } = pageSize;

    const prevIsCalculated = React.useRef(false);

    const scaledWidth = pageWidth * scale;
    const scaledHeight = pageHeight * scale;

    const isVertical = Math.abs(rotation) % 180 === 0;
    const w = isVertical ? scaledWidth : scaledHeight;
    const h = isVertical ? scaledHeight : scaledWidth;

    const determinePageSize = () => {
        if (prevIsCalculated.current) {
            return;
        }
        prevIsCalculated.current = true;

        getPage(doc, pageIndex).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });

            setPageSize({
                page: pdfPage,
                pageHeight: viewport.height,
                pageWidth: viewport.width,
                viewportRotation: viewport.rotation,
            });
        });
    };

    const visibilityChanged = (params: VisibilityChanged): void => {
        onPageVisibilityChanged(pageIndex, params.isVisible ? params.ratio : -1);
    };

    // Default page renderer
    const defaultPageRenderer: RenderPage = (props: RenderPageProps) => (
        <>
            {props.canvasLayer.children}
            {props.textLayer.children}
            {props.annotationLayer.children}
        </>
    );
    const renderPageLayer = renderPage || defaultPageRenderer;

    // To support the document which is already rotated
    const rotationNumber = (rotation + pageSize.viewportRotation) % 360;

    const containerRef = useIntersectionObserver({
        threshold: INTERSECTION_THRESHOLD,
        onVisibilityChanged: visibilityChanged,
    });

    React.useEffect(() => {
        if (shouldRender) {
            determinePageSize();
        }
    }, [shouldRender]);

    return (
        <div
            ref={containerRef}
            className="rpv-core__page-layer"
            data-testid={`core__page-layer-${pageIndex}`}
            style={{
                height: `${h}px`,
                width: `${w}px`,
            }}
        >
            {!page ? (
                <Spinner />
            ) : (
                <>
                    {renderPageLayer({
                        annotationLayer: {
                            attrs: {},
                            children: (
                                <AnnotationLayer
                                    doc={doc}
                                    page={page}
                                    pageIndex={pageIndex}
                                    plugins={plugins}
                                    rotation={rotationNumber}
                                    scale={scale}
                                    onExecuteNamedAction={onExecuteNamedAction}
                                    onJumpToDest={onJumpToDest}
                                />
                            ),
                        },
                        canvasLayer: {
                            attrs: {},
                            children: (
                                <CanvasLayer
                                    height={h}
                                    page={page}
                                    pageIndex={pageIndex}
                                    plugins={plugins}
                                    rotation={rotationNumber}
                                    scale={scale}
                                    width={w}
                                    onRenderCompleted={onRenderCompleted}
                                />
                            ),
                        },
                        doc,
                        height: h,
                        pageIndex,
                        rotation,
                        scale,
                        svgLayer: {
                            attrs: {},
                            children: (
                                <SvgLayer height={h} page={page} rotation={rotationNumber} scale={scale} width={w} />
                            ),
                        },
                        textLayer: {
                            attrs: {},
                            children: (
                                <TextLayer
                                    page={page}
                                    pageIndex={pageIndex}
                                    plugins={plugins}
                                    rotation={rotationNumber}
                                    scale={scale}
                                />
                            ),
                        },
                        width: w,
                    })}
                    {plugins.map((plugin, idx) =>
                        plugin.renderPageLayer ? (
                            <React.Fragment key={idx}>
                                {plugin.renderPageLayer({
                                    doc,
                                    height: h,
                                    pageIndex,
                                    rotation,
                                    scale,
                                    width: w,
                                })}
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={idx}></React.Fragment>
                        )
                    )}
                </>
            )}
        </div>
    );
};
