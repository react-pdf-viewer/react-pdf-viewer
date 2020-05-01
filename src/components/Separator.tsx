/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContext from '../theme/ThemeContext';
import './separator.less';

const Separator: React.FC<{}> = () => {
    const theme = React.useContext(ThemeContext);

    return (
        <div className={`${theme.prefixClass}-separator`} />
    );
};

export default Separator;
