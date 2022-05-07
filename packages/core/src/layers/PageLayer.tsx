/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { AnnotationLayer } from '../annotations/AnnotationLayer';
import { Spinner } from '../components/Spinner';
import { useIsMounted } from '../hooks/useIsMounted';
import { RotateDirection } from '../structs/RotateDirection';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import type { RenderPage, RenderPageProps } from '../types/RenderPage';
import { getPage } from '../utils/managePages';
import { CanvasLayer } from './CanvasLayer';
import { SvgLayer } from './SvgLayer';
import { TextLayer } from './TextLayer';

interface PageSizeState {
    page?: PdfJs.Page | null;
    pageHeight: number;
    pageWidth: number;
    viewportRotation: number;
}

export const PageLayer: React.FC<{
    doc: PdfJs.PdfDocument;
    height: number;
    measureRef: (ele: HTMLElement) => void;
    pageIndex: number;
    pageRotation: number;
    plugins: Plugin[];
    renderPage?: RenderPage;
    rotation: number;
    scale: number;
    shouldRender: boolean;
    width: number;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
    onRenderCompleted(pageIndex: number): void;
    onRotatePage(pageIndex: number, direction: RotateDirection): void;
}> = ({
    doc,
    height,
    measureRef,
    pageIndex,
    pageRotation,
    plugins,
    renderPage,
    rotation,
    scale,
    shouldRender,
    width,
    onExecuteNamedAction,
    onJumpToDest,
    onRenderCompleted,
    onRotatePage,
}) => {
    const isMounted = useIsMounted();
    const [pageSize, setPageSize] = React.useState<PageSizeState>({
        page: null,
        pageHeight: height,
        pageWidth: width,
        viewportRotation: 0,
    });
    const [canvasLayerRendered, setCanvasLayerRendered] = React.useState(false);
    const [textLayerRendered, setTextLayerRendered] = React.useState(false);

    const { page, pageHeight, pageWidth } = pageSize;

    const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;
    const scaledWidth = pageWidth * scale;
    const scaledHeight = pageHeight * scale;

    const w = isVertical ? scaledWidth : scaledHeight;
    const h = isVertical ? scaledHeight : scaledWidth;

    // To support the document which is already rotated
    const rotationValue = (pageSize.viewportRotation + rotation + pageRotation) % 360;

    const determinePageSize = () => {
        getPage(doc, pageIndex).then((pdfPage) => {
            const viewport = pdfPage.getViewport({ scale: 1 });
            isMounted.current &&
                setPageSize({
                    page: pdfPage,
                    pageHeight: viewport.height,
                    pageWidth: viewport.width,
                    viewportRotation: viewport.rotation,
                });
        });
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

    const handleRenderCanvasCompleted = () => {
        if (isMounted.current) {
            setCanvasLayerRendered(true);
        }
    };
    const handleRenderTextCompleted = () => {
        if (isMounted.current) {
            setTextLayerRendered(true);
        }
    };

    React.useEffect(() => {
        setPageSize({
            page: null,
            pageHeight: height,
            pageWidth: width,
            viewportRotation: 0,
        });
        setCanvasLayerRendered(false);
        setTextLayerRendered(false);
    }, [pageRotation, rotation, scale]);

    React.useEffect(() => {
        if (shouldRender && isMounted.current && !page) {
            determinePageSize();
        }
    }, [shouldRender, page]);

    React.useEffect(() => {
        if (canvasLayerRendered && textLayerRendered) {
            onRenderCompleted(pageIndex);
        }
    }, [canvasLayerRendered, textLayerRendered]);

    return (
        <div
            className="rpv-core__page-layer"
            data-testid={`core__page-layer-${pageIndex}`}
            ref={measureRef}
            style={{
                height: `${h}px`,
                width: `${w}px`,
            }}
        >
            {!page ? (
                <Spinner testId={`core__page-layer-loading-${pageIndex}`} />
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
                                    rotation={rotationValue}
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
                                    rotation={rotationValue}
                                    scale={scale}
                                    width={w}
                                    onRenderCanvasCompleted={handleRenderCanvasCompleted}
                                />
                            ),
                        },
                        canvasLayerRendered,
                        doc,
                        height: h,
                        pageIndex,
                        rotation: rotationValue,
                        scale,
                        svgLayer: {
                            attrs: {},
                            children: (
                                <SvgLayer height={h} page={page} rotation={rotationValue} scale={scale} width={w} />
                            ),
                        },
                        textLayer: {
                            attrs: {},
                            children: (
                                <TextLayer
                                    page={page}
                                    pageIndex={pageIndex}
                                    plugins={plugins}
                                    rotation={rotationValue}
                                    scale={scale}
                                    onRenderTextCompleted={handleRenderTextCompleted}
                                />
                            ),
                        },
                        textLayerRendered,
                        width: w,
                        markRendered: onRenderCompleted,
                        onRotatePage: (direction: RotateDirection) => onRotatePage(pageIndex, direction),
                    })}
                    {plugins.map((plugin, idx) =>
                        plugin.renderPageLayer ? (
                            <React.Fragment key={idx}>
                                {plugin.renderPageLayer({
                                    doc,
                                    height: h,
                                    pageIndex,
                                    rotation: rotationValue,
                                    scale,
                                    width: w,
                                })}
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={idx} />
                        )
                    )}
                </>
            )}
        </div>
    );
};
