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
import './popupWrapper.less';

interface PopupWrapperProps {
    annotation: PdfJs.Annotation;
}

const PopupWrapper: React.FC<PopupWrapperProps> = ({ annotation }) => {
    const theme = useContext(ThemeContent);

    return (
        <div className={`${theme.prefixClass}-annotation-popup-wrapper`} >
            Popup
        </div>
    );
};

export default PopupWrapper;
