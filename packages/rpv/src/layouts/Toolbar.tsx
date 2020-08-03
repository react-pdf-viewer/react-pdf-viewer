/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useState } from 'react';

import Button from '../components/Button';
import LeftSidebarIcon from '../icons/LeftSidebarIcon';
import { RenderToolbarSlot } from './ToolbarSlot';
import LocalizationContext from '../localization/LocalizationContext';
import LocalizationMap from '../localization/LocalizationMap';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';

interface ToolbarProps {
    renderToolbar: RenderToolbarSlot;
    onToggleSidebar(): void;
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const Toolbar: React.FC<ToolbarProps> = ({
    onToggleSidebar,
    renderToolbar,
}) => {
    const l10n = useContext(LocalizationContext);
    const [isSidebarOpened, setSidebarOpened] = useState(false);

    const toggleSidebar = (): void => {
        setSidebarOpened(!isSidebarOpened);
        onToggleSidebar();
    };

    const renderToggle = (): LocalizationMap => l10n.toolbar.toggleSidebar;

    return renderToolbar({
        toggleSidebarButton: (
            <Tooltip
                position={Position.BottomLeft}
                target={(
                    <Button onClick={toggleSidebar} isSelected={isSidebarOpened}>
                        <LeftSidebarIcon />
                    </Button>
                )}
                content={renderToggle}
                offset={TOOLTIP_OFFSET}
            />
        ),
    });
};

export default Toolbar;
