/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import AnnotationLayer from '../annotations/AnnotationLayer';
import Spinner from '../components/Spinner';
import Observer, { VisibilityChanged } from '../layouts/Observer';
import RenderPageProps, { RenderPage } from '../layouts/RenderPage';
import Match from '../search/Match';
import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import CanvasLayer from './CanvasLayer';
import './pageLayer.less';
import SvgLayer from './SvgLayer';
import TextLayer from './TextLayer';

interface PageLayerProps {
    doc: PdfJs.PdfDocument;
    height: number;
    keywordRegexp: RegExp;
    match: Match;
    pageIndex: number;
    renderPage?: RenderPage;
    rotation: number;
    scale: number;
    width: number;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
    onPageVisibilityChanged(pageIndex: number, ratio: number): void;
}

interface PageSizeState {
    isCalculated: boolean;
    page?: PdfJs.Page | null;
    pageHeight: number;
    pageWidth: number;
}

const PageLayer: React.FC<PageLayerProps> = ({
    doc, height, keywordRegexp, match, pageIndex, renderPage, rotation, scale, width,
    onJumpToDest, onPageVisibilityChanged,
}) => {
    const theme = React.useContext(ThemeContent);
    const [pageSize, setPageSize] = React.useState<PageSizeState>({
        isCalculated: false,
        page: null,
        pageHeight: height,
        pageWidth: width,
    });
    const { isCalculated, page, pageHeight, pageWidth } = pageSize;

    const intersectionThreshold = Array(10).fill(null).map((_, i) => i / 10);

    const scaledWidth = pageWidth * scale;
    const scaledHeight = pageHeight * scale;

    const isVertical = Math.abs(rotation) % 180 === 0;
    const w = isVertical ? scaledWidth : scaledHeight;
    const h = isVertical ? scaledHeight : scaledWidth;

    const visibilityChanged = (params: VisibilityChanged): void => {
        const ratio = params.isVisible ? params.ratio : 0;
        onPageVisibilityChanged(pageIndex, ratio);

        if (params.isVisible && !isCalculated) {
            doc.getPage(pageIndex + 1).then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 1 });

                setPageSize({
                    isCalculated: true,
                    page: pdfPage,
                    pageHeight: viewport.height,
                    pageWidth: viewport.width,
                });
            });
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const jumpToMatch = (indexOfPage: number, top: number, left: number): void => {
        onJumpToDest(indexOfPage, pageHeight - top, scale);
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

    return (
        <Observer onVisibilityChanged={visibilityChanged} threshold={intersectionThreshold}>
            <div
                className={`${theme.prefixClass}-page-layer`}
                style={{
                    height: `${h}px`,
                    width: `${w}px`,
                }}
            >
                {
                    !page
                        ? <Spinner />
                        : renderPageLayer({
                            annotationLayer: {
                                attrs: {},
                                children: (
                                    <AnnotationLayer
                                        doc={doc}
                                        page={page}
                                        rotation={rotation}
                                        scale={scale}
                                        onJumpToDest={onJumpToDest}
                                    />
                                )
                            },
                            canvasLayer: {
                                attrs: {},
                                children: (
                                    <CanvasLayer height={h} page={page} rotation={rotation} scale={scale} width={w} />
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
                                    <SvgLayer height={h} page={page} rotation={rotation} scale={scale} width={w} />
                                ),
                            },
                            textLayer: {
                                attrs: {},
                                children: (
                                    <TextLayer
                                        keywordRegexp={keywordRegexp}
                                        match={match}
                                        page={page}
                                        pageIndex={pageIndex}
                                        rotation={rotation}
                                        scale={scale}
                                        onJumpToMatch={jumpToMatch}
                                    />
                                )
                            },
                            width: w,
                        })
                }
            </div>
        </Observer>
    );
};

export default PageLayer;
