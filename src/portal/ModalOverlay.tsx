/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import ThemeContext from '../theme/ThemeContext';
import './modalOverlay.less';

const ModalOverlay: React.FC<{}> = ({ children }) => {
    const theme = useContext(ThemeContext);

    return (
        <div className={`${theme.prefixClass}-modal-overlay`}>
            {children}
        </div>
    );
};

export default ModalOverlay;
