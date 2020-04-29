/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContent from '../theme/ThemeContext';
import getDestination from '../utils/getDestination';
import PdfJs from '../vendors/PdfJs';
import './link.less';
import Annotation from './Annotation';

interface LinkProps {
    annotation: PdfJs.Annotation;
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const Link: React.FC<LinkProps> = ({ annotation, doc, page, viewport, onJumpToDest }) => {
    const theme = useContext(ThemeContent);
    const { dest, rect } = annotation;
    const href = (typeof dest === 'string') ? `#${escape(dest)}` : `#${escape(JSON.stringify(dest))}`;

    const link = (e: React.MouseEvent): void => {
        e.preventDefault();
        getDestination(doc, dest).then((target) => {
            const { pageIndex, bottomOffset, scaleTo } = target;
            onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
        });
    };

    const isRenderable = !!(annotation.url || annotation.dest || annotation.action);

    return (
        <Annotation annotation={annotation} hasPopup={false} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(_) => (
                <a
                    className={`${theme.prefixClass}-annotation-link`}
                    href={href}
                    onClick={link}
                />
            )}
        </Annotation>
    );
};

export default Link;
