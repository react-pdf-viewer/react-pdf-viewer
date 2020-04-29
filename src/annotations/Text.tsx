/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import './link.less';
import Annotation from './Annotation';

interface TextProps {
    annotation: PdfJs.Annotation;
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}

const Text: React.FC<TextProps> = ({ annotation, doc, page, viewport }) => {
    const theme = useContext(ThemeContent);
    const hasPopup = annotation.hasPopup === false;

    return (
        <Annotation annotation={annotation} hasPopup={hasPopup} page={page} viewport={viewport}>
            {(props) => (
                <div
                    style={{
                        height: '100%',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                    }}
                    onMouseEnter={() => hasPopup && props.openPopupWhenHover()}
                    onMouseLeave={() => hasPopup && props.closePopupWhenHover()}
                    onClick={() => hasPopup && props.togglePopupWhenClick()}
                />
            )}
        </Annotation>
    );
};

export default Text;
