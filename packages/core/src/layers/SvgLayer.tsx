/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { type PdfJs } from '../types/PdfJs';
import { PdfJsApiContext } from '../vendors/PdfJsApiContext';

export const SvgLayer: React.FC<{
    height: number;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
    width: number;
}> = ({ height, page, rotation, scale, width }) => {
    const { pdfJsApiProvider } = React.useContext(PdfJsApiContext);
    const containerRef = React.useRef<HTMLDivElement>();

    const empty = (): void => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        containerEle.innerHTML = '';
    };

    useIsomorphicLayoutEffect(() => {
        const containerEle = containerRef.current as HTMLDivElement;
        const viewport = page.getViewport({ rotation, scale });

        page.getOperatorList().then((operatorList) => {
            empty();
            const graphic = new pdfJsApiProvider.SVGGraphics(page.commonObjs, page.objs) as PdfJs.SVGGraphics;
            graphic.getSVG(operatorList, viewport).then((svg) => {
                // It seems that we don't have to set the size for `svg`
                svg.style.height = `${height}px`;
                svg.style.width = `${width}px`;

                containerEle.appendChild(svg);
            });
        });
    }, []);

    return <div className="rpv-core__svg-layer" ref={containerRef} />;
};
