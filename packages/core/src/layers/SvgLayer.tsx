/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import PdfJs from '../vendors/PdfJs';
import WithScale from './WithScale';

interface SvgLayerProps {
    height: number;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
    width: number;
}

const SvgLayer: React.FC<SvgLayerProps> = ({ height, page, rotation, scale, width }) => {
    const containerRef = React.useRef<HTMLDivElement>();

    const empty = (): void => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        containerEle.innerHTML = '';
    };

    const renderSvg = (): void => {
        const containerEle = containerRef.current as HTMLDivElement;
        const viewport = page.getViewport({ rotation, scale });

        page.getOperatorList().then((operatorList) => {
            empty();
            const graphic = new PdfJs.SVGGraphics(page.commonObjs, page.objs);
            graphic.getSVG(operatorList, viewport).then((svg) => {
                // It seems that we don't have to set the size for `svg`
                svg.style.height = `${height}px`;
                svg.style.width = `${width}px`;

                containerEle.appendChild(svg);
            });
        });
    };

    return (
        <WithScale callback={renderSvg} rotation={rotation} scale={scale}>
            <div className="rpv-core__svg-layer" ref={containerRef} />
        </WithScale>
    );
};

export default SvgLayer;
