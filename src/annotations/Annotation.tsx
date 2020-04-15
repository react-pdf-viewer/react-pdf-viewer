/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import './annotation.less';

interface AnnotationProps {
    page: PdfJs.Page;
    rect: number[];
    viewport: PdfJs.ViewPort;
}

const Annotation: React.FC<AnnotationProps> = ({ page, rect, viewport }) => {
    const theme = React.useContext(ThemeContent);

    const normalizeRect = (r: number[]) => [
        Math.min(r[0], r[2]),
        Math.min(r[1], r[3]),
        Math.max(r[0], r[2]),
        Math.max(r[1], r[3]),
    ];

    const bound = normalizeRect([
        rect[0],
        page.view[3] + page.view[1] - rect[1],
        rect[2],
        page.view[3] + page.view[1] - rect[3],
    ]);

    let width = rect[2] - rect[0];
    let height = rect[3] - rect[1];

    return (
        <div
            className={`${theme.prefixClass}-annotation`}
            style={{
                height: `${height}px`,
                left: `${bound[0]}px`,
                top: `${bound[1]}px`,
                transform: `matrix(${viewport.transform.join(',')})`,
                transformOrigin: `-${bound[0]}px -${bound[1]}px`,
                width: `${width}px`,
            }}
        >
        </div>
    );
};

export default Annotation;
