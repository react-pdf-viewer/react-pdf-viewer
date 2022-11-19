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
import type { PageSize } from '../types/PageSize';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import type { DestinationOffsetFromViewport } from '../types/PluginFunctions';
import type { RenderPage, RenderPageProps } from '../types/RenderPage';
import { getPage } from '../utils/managePages';
import { CanvasLayer } from './CanvasLayer';
import { SvgLayer } from './SvgLayer';
import { TextLayer } from './TextLayer';

export const PageLayer: React.FC<{
    doc: PdfJs.PdfDocument;
    outlines: PdfJs.Outline[];
    pageIndex: number;
    pageRotation: number;
    pageSize: PageSize;
    plugins: Plugin[];
    renderPage?: RenderPage;
    renderQueueKey: number;
    rotation: number;
    scale: number;
    shouldRender: boolean;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(
        pageIndex: number,
        bottomOffset: number | DestinationOffsetFromViewport,
        leftOffset: number | DestinationOffsetFromViewport,
        scaleTo?: number | SpecialZoomLevel
    ): void;
    onRenderCompleted(pageIndex: number): void;
    onRotatePage(pageIndex: number, direction: RotateDirection): void;
}> = ({
    doc,
    outlines,
    pageIndex,
    pageRotation,
    pageSize,
    plugins,
    renderPage,
    renderQueueKey,
    rotation,
    scale,
    shouldRender,
    onExecuteNamedAction,
    onJumpToDest,
    onRenderCompleted,
    onRotatePage,
}) => {
    const isMounted = useIsMounted();
    const [page, setPage] = React.useState<PdfJs.Page>(null);
    const [canvasLayerRendered, setCanvasLayerRendered] = React.useState(false);
    const [textLayerRendered, setTextLayerRendered] = React.useState(false);
    const canvasLayerRef = React.useRef<HTMLCanvasElement>();
    const textLayerRef = React.useRef<HTMLDivElement>();

    const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;
    const scaledWidth = pageSize.pageWidth * scale;
    const scaledHeight = pageSize.pageHeight * scale;

    const w = isVertical ? scaledWidth : scaledHeight;
    const h = isVertical ? scaledHeight : scaledWidth;

    // To support the document which is already rotated
    const rotationValue = (pageSize.rotation + rotation + pageRotation) % 360;

    const renderQueueKeyRef = React.useRef(0);

    const determinePageInstance = () => {
        getPage(doc, pageIndex).then((pdfPage) => {
            if (isMounted.current) {
                renderQueueKeyRef.current = renderQueueKey;
                setPage(pdfPage);
            }
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
        setPage(null);
        setCanvasLayerRendered(false);
        setTextLayerRendered(false);
    }, [pageRotation, rotation, scale]);

    React.useEffect(() => {
        if (shouldRender && isMounted.current && !page) {
            determinePageInstance();
        }
    }, [shouldRender, page]);

    React.useEffect(() => {
        if (canvasLayerRendered && textLayerRendered) {
            if (renderQueueKey !== renderQueueKeyRef.current) {
                // The page is rendered in the queue which is not the current queue
                // (For example, when users zoom or rotate the document)
                // Reset page and layer statuses
                setPage(null);
                setCanvasLayerRendered(false);
                setTextLayerRendered(false);
            } else {
                onRenderCompleted(pageIndex);
            }
        }
    }, [canvasLayerRendered, textLayerRendered]);

    return (
        <div
            className="rpv-core__page-layer"
            data-testid={`core__page-layer-${pageIndex}`}
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
                                    outlines={outlines}
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
                                    canvasLayerRef={canvasLayerRef}
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
                                    containerRef={textLayerRef}
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
                                    canvasLayerRef,
                                    canvasLayerRendered,
                                    doc,
                                    height: h,
                                    pageIndex,
                                    rotation: rotationValue,
                                    scale,
                                    textLayerRef,
                                    textLayerRendered,
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
