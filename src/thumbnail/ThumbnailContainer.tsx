/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Spinner from '../components/Spinner';
import Observer, { VisibilityChanged } from '../layouts/Observer';
import ThemeContext from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import ThumbnailItem from './ThumbnailItem';
import './thumbnailContainer.less';

const THUMBNAIL_WIDTH = 100;

interface ThumbnailContainerProps {
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageIndex: number;
    pageWidth: number;
    rotation: number;
}

interface PageState {
    height: number;
    isCalculated: boolean;
    page: PdfJs.Page | null;
    width: number;
}

const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({ doc, pageHeight, pageIndex, pageWidth, rotation }) => {
    const theme = React.useContext(ThemeContext);
    const [pageSize, setPageSize] = React.useState<PageState>({
        height: pageHeight,
        isCalculated: false,
        page: null,
        width: pageWidth,
    });
    const { isCalculated, page, height, width } = pageSize;

    const scale = width / height;
    const isVertical = Math.abs(rotation) % 180 === 0;
    const w = isVertical ? THUMBNAIL_WIDTH : (THUMBNAIL_WIDTH / scale);
    const h = isVertical ? (THUMBNAIL_WIDTH / scale) : THUMBNAIL_WIDTH;

    const onVisibilityChanged = (params: VisibilityChanged): void => {
        if (params.isVisible && !isCalculated) {
            doc.getPage(pageIndex + 1).then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 1 });

                setPageSize({
                    height: viewport.height,
                    isCalculated: true,
                    page: pdfPage,
                    width: viewport.width,
                });
            });
        }
    };

    return (
        <Observer onVisibilityChanged={onVisibilityChanged}>
            <div
                className={`${theme.prefixClass}-thumbnail-container`}
                style={{
                    height: `${h}px`,
                    width: `${w}px`,
                }}
            >
                {
                    !page
                        ? <Spinner />
                        : (
                            <ThumbnailItem
                                page={page}
                                pageHeight={isVertical ? height : width}
                                pageWidth={isVertical ? width : height}
                                rotation={rotation}
                                thumbnailHeight={h}
                                thumbnailWidth={w}
                            />
                        )
                }
            </div>
        </Observer>
    );
};

export default ThumbnailContainer;
