/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Observer, { VisibilityChanged } from '../Observer';
import PdfJs from '../PdfJs';
import Match from '../search/Match';
import Spinner from '../components/Spinner';
import ThemeContent from '../theme/ThemeContext';
import { SpecialLevel } from '../zoom/zoomingLevel';
import AnnotationLayer from './AnnotationLayer';
import CanvasLayer from './CanvasLayer';
import './pageLayer.less';
import TextLayer from './TextLayer';

interface PageLayerProps {
    doc: PdfJs.PdfDocument;
    height: number;
    keywordRegexp: RegExp;
    match: Match;
    pageIndex: number;
    rotation: number;
    scale: number;
    width: number;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialLevel): void;
    onPageVisibilityChanged(pageIndex: number, ratio: number): void;
}

interface PageSizeState {
    isCalculated: boolean;
    page?: PdfJs.Page | null;
    pageHeight: number;
    pageWidth: number;
}

const PageLayer: React.FC<PageLayerProps> = ({
    doc, height, keywordRegexp, match, pageIndex, rotation, scale, width,
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

    const visibilityChanged = (params: VisibilityChanged) => {
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

    const jumpToMatch = (indexOfPage: number, top: number, left: number) => {
        onJumpToDest(indexOfPage, pageHeight - top, scale);
    };

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
                        : (
                            <>
                                <CanvasLayer height={h} page={page} rotation={rotation} scale={scale} width={w} />
                                <TextLayer
                                    keywordRegexp={keywordRegexp}
                                    match={match}
                                    page={page}
                                    pageIndex={pageIndex}
                                    rotation={rotation}
                                    scale={scale}
                                    onJumpToMatch={jumpToMatch}
                                />
                                <AnnotationLayer
                                    doc={doc}
                                    page={page}
                                    rotation={rotation}
                                    scale={scale}
                                    onJumpToDest={onJumpToDest}
                                />
                            </>
                        )
                }
            </div>
        </Observer>
    );
};

export default PageLayer;
