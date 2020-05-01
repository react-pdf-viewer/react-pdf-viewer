/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContext from '../theme/ThemeContext';
import getDestination from '../utils/getDestination';
import SpecialZoomLevel from '../SpecialZoomLevel';
import PdfJs from '../vendors/PdfJs';
import './annotationLayer.less';
import WithScale from './WithScale';

interface AnnotationLayerProps {
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ doc, page, rotation, scale, onJumpToDest }) => {
    const containerRef = React.createRef<HTMLDivElement>();
    const theme = React.useContext(ThemeContext);

    const renderAnnotation = (): void => {
        const container = containerRef.current;
        if (container) {
            container.innerHTML = '';
        }

        const viewport = page.getViewport({ rotation, scale });
        page.getAnnotations({ intent: 'display' }).then((annotations) => {
            if (annotations.length === 0) {
                return;
            }

            const linkService: PdfJs.LinkService = {
                getDestinationHash: (dest: PdfJs.OutlineDestinationType): string => {
                    return (typeof dest === 'string')
                            ? `#${escape(dest)}`
                            : `#${escape(JSON.stringify(dest))}`;
                },
                navigateTo: (dest: PdfJs.OutlineDestinationType) => {
                    getDestination(doc, dest).then((target) => {
                        const { pageIndex, bottomOffset, scaleTo } = target;
                        onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
                    });
                },
            };

            const clonedViewPort = viewport.clone({ dontFlip: true });
            PdfJs.AnnotationLayer.render({
                annotations,
                div: container,
                linkService,
                page,
                viewport: clonedViewPort,
            });
        });
    };

    return (
        <WithScale callback={renderAnnotation} rotation={rotation} scale={scale}>
            <div className={`${theme.prefixClass}-annotation-layer`} ref={containerRef} />
        </WithScale>
    );
};

export default AnnotationLayer;
