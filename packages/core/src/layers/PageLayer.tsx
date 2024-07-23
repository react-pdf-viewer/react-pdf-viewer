/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { AnnotationLayer } from '../annotations/AnnotationLayer';
import { Spinner } from '../components/Spinner';
import { useIsMounted } from '../hooks/useIsMounted';
import { useSafeState } from '../hooks/useSafeState';
import { RotateDirection } from '../structs/RotateDirection';
import { ViewMode } from '../structs/ViewMode';
import styles from '../styles/pageLayer.module.css';
import { type Destination } from '../types/Destination';
import { type PageSize } from '../types/PageSize';
import { type PdfJs } from '../types/PdfJs';
import { type Plugin } from '../types/Plugin';
import { type RenderPage, type RenderPageProps } from '../types/RenderPage';
import { classNames } from '../utils/classNames';
import { getPage } from '../utils/managePages';
import { CanvasLayer } from './CanvasLayer';
import { SvgLayer } from './SvgLayer';
import { TextLayer } from './TextLayer';

export const PageLayer: React.FC<{
    doc: PdfJs.PdfDocument;
    measureRef: React.RefCallback<HTMLElement>;
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
    viewMode: ViewMode;
    onExecuteNamedAction(action: string): void;
    onJumpFromLinkAnnotation(destination: Destination): void;
    onJumpToDest(destination: Destination): void;
    onRenderCompleted(pageIndex: number): void;
    onRotatePage(pageIndex: number, direction: RotateDirection): void;
}> = ({
    doc,
    measureRef,
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
    viewMode,
    onExecuteNamedAction,
    onJumpFromLinkAnnotation,
    onJumpToDest,
    onRenderCompleted,
    onRotatePage,
}) => {
    const isMountedRef = useIsMounted();
    const [page, setPage] = useSafeState<PdfJs.Page | null>(null);
    const [canvasLayerRendered, setCanvasLayerRendered] = useSafeState(false);
    const [textLayerRendered, setTextLayerRendered] = useSafeState(false);
    const canvasLayerRef = React.useRef<HTMLCanvasElement>(null);
    const textLayerRef = React.useRef<HTMLDivElement>(null);

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
            renderQueueKeyRef.current = renderQueueKey;
            setPage(pdfPage);
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
        setCanvasLayerRendered(true);
    };
    const handleRenderTextCompleted = () => {
        setTextLayerRendered(true);
    };

    const renderPluginsLayer = (plugins: Plugin[]) =>
        plugins.map((plugin, idx) => (
            <React.Fragment key={idx}>
                {plugin.dependencies && renderPluginsLayer(plugin.dependencies)}
                {plugin.renderPageLayer &&
                    plugin.renderPageLayer({
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
        ));

    React.useEffect(() => {
        setPage(null);
        setCanvasLayerRendered(false);
        setTextLayerRendered(false);
    }, [pageRotation, rotation, scale]);

    React.useEffect(() => {
        if (shouldRender && isMountedRef.current && !page) {
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
            className={classNames({
                [styles.layer]: true,
                [styles.layerSingle]: viewMode === ViewMode.SinglePage,
            })}
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
                                    outlines={outlines}
                                    page={page}
                                    pageIndex={pageIndex}
                                    plugins={plugins}
                                    rotation={rotationValue}
                                    scale={scale}
                                    onExecuteNamedAction={onExecuteNamedAction}
                                    onJumpFromLinkAnnotation={onJumpFromLinkAnnotation}
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
                    {renderPluginsLayer(plugins)}
                </>
            )}
        </div>
    );
};
