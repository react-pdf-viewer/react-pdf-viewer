/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import ThemeContext from '../theme/ThemeContext';
import './defaultToolbar.less';
import ToolbarSlot, { RenderToolbarSlot } from './ToolbarSlot';

const defaultToolbar: RenderToolbarSlot = (toolbarSlot: ToolbarSlot): React.ReactElement => {
    const theme = useContext(ThemeContext);

    return (
        <div className={`${theme.prefixClass}-toolbar`}>
            <div className={`${theme.prefixClass}-toolbar-left`}>
                <div className={`${theme.prefixClass}-toolbar-item`}>
                    {toolbarSlot.toggleSidebarButton}
                </div>
                <div className={`${theme.prefixClass}-toolbar-item`}>
                    {toolbarSlot.searchPopover}
                </div>
            </div>
        </div>
    );
};

export default defaultToolbar;
