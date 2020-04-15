/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';

interface LinkProps {
    page: PdfJs.Page;
    rect: number[];
    viewport: PdfJs.ViewPort;
}

const Link: React.FC<LinkProps> = ({ page, rect, viewport }) => {
    return (
        <Annotation page={page} rect={rect} viewport={viewport} />
    );
};

export default Link;
