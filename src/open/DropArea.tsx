/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import ThemeContent from '../theme/ThemeContext';
import './dropArea.less';

const DropArea: React.FC<{}> = () => {
    const l10n = React.useContext(LocalizationContext);
    const theme = React.useContext(ThemeContent);

    return (
        <div className={`${theme.prefixClass}-drop-area`}>
            {l10n.main.dragDropFile}
        </div>
    );
};

export default DropArea;
