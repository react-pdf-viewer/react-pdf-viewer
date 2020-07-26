/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { Button, LocalizationContext, Menu, Popover, Position, Toggle, Tooltip } from '@phuocng/rpv';

import MoreIcon from './MoreIcon';
import ToolbarSlot from './ToolbarSlot';

interface MoreActionsPopoverProps {
    toolbarSlot: ToolbarSlot;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

const MoreActionsPopover: React.FC<MoreActionsPopoverProps> = ({ toolbarSlot }) => {
    const l10n = useContext(LocalizationContext);
    const { GoToFirstPageMenuItem, GoToLastPageMenuItem } = toolbarSlot;

    const renderTarget = (toggle: Toggle, opened: boolean): React.ReactElement => {
        const label = (l10n && l10n.plugins && l10n.plugins.toolbar)
            ? l10n.plugins.toolbar.moreActions
            : 'More actions';

        return (
            <Tooltip
                position={Position.BottomRight}
                target={<Button onClick={toggle} isSelected={opened}><MoreIcon /></Button>}
                content={() => label}
                offset={PORTAL_OFFSET}
            />
        );
    };

    const renderContent = (toggle: Toggle): React.ReactElement => {
        return (
            <Menu>
                <GoToFirstPageMenuItem onClick={toggle} />
                <GoToLastPageMenuItem onClick={toggle} />
            </Menu>
        );
    };

    return (
        <Popover
            position={Position.BottomRight}
            target={renderTarget}
            content={renderContent}
            offset={PORTAL_OFFSET}
            closeOnClickOutside={true}
            closeOnEscape={true}
        />
    );
};

export default MoreActionsPopover;
