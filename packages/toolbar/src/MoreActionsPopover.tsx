/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import {
    LocalizationContext,
    Menu,
    MenuDivider,
    MinimalButton,
    Popover,
    Position,
    Toggle,
    Tooltip,
} from '@react-pdf-viewer/core';
import { ScrollMode } from '@react-pdf-viewer/scroll-mode';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';

import MoreIcon from './MoreIcon';
import ToolbarSlot from './ToolbarSlot';

interface MoreActionsPopoverProps {
    toolbarSlot: ToolbarSlot;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

const MoreActionsPopover: React.FC<MoreActionsPopoverProps> = ({ toolbarSlot }) => {
    const l10n = React.useContext(LocalizationContext);
    const {
        DownloadMenuItem,
        EnterFullScreenMenuItem,
        GoToFirstPageMenuItem,
        GoToLastPageMenuItem,
        GoToNextPageMenuItem,
        GoToPreviousPageMenuItem,
        OpenMenuItem,
        PrintMenuItem,
        RotateBackwardMenuItem,
        RotateForwardMenuItem,
        ShowPropertiesMenuItem,
        SwitchScrollModeMenuItem,
        SwitchSelectionModeMenuItem,
        SwitchThemeMenuItem,
    } = toolbarSlot;

    const renderTarget = (toggle: Toggle, opened: boolean): React.ReactElement => {
        const label = l10n && l10n.toolbar ? l10n.toolbar.moreActions : 'More actions';

        return (
            <Tooltip
                position={Position.BottomRight}
                target={
                    <MinimalButton onClick={toggle} isSelected={opened}>
                        <MoreIcon />
                    </MinimalButton>
                }
                content={() => label}
                offset={PORTAL_OFFSET}
            />
        );
    };

    const renderContent = (toggle: Toggle): React.ReactElement => {
        return (
            <Menu>
                {/* These items will be hidden on the larger screens */}
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <SwitchThemeMenuItem onClick={toggle} />
                </div>
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <EnterFullScreenMenuItem onClick={toggle} />
                </div>
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <OpenMenuItem />
                </div>
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <PrintMenuItem onClick={toggle} />
                </div>
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <DownloadMenuItem onClick={toggle} />
                </div>
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <MenuDivider />
                </div>

                <GoToFirstPageMenuItem onClick={toggle} />
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <GoToPreviousPageMenuItem onClick={toggle} />
                </div>
                <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    <GoToNextPageMenuItem onClick={toggle} />
                </div>
                <GoToLastPageMenuItem onClick={toggle} />
                <MenuDivider />
                <RotateForwardMenuItem onClick={toggle} />
                <RotateBackwardMenuItem onClick={toggle} />
                <MenuDivider />
                <SwitchSelectionModeMenuItem mode={SelectionMode.Text} onClick={toggle} />
                <SwitchSelectionModeMenuItem mode={SelectionMode.Hand} onClick={toggle} />
                <MenuDivider />
                <SwitchScrollModeMenuItem mode={ScrollMode.Vertical} onClick={toggle} />
                <SwitchScrollModeMenuItem mode={ScrollMode.Horizontal} onClick={toggle} />
                <SwitchScrollModeMenuItem mode={ScrollMode.Wrapped} onClick={toggle} />
                <MenuDivider />
                <ShowPropertiesMenuItem onClick={toggle} />
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
