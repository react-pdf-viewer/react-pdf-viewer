/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap, Toggle } from '@react-pdf-viewer/core';
import {
    LocalizationContext,
    Menu,
    MenuDivider,
    MinimalButton,
    Popover,
    Position,
    ScrollMode,
    TextDirection,
    ThemeContext,
    Tooltip,
    ViewMode,
} from '@react-pdf-viewer/core';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';
import * as React from 'react';
import { MoreIcon } from './MoreIcon';
import type { ToolbarSlot } from './types/ToolbarSlot';

const PORTAL_OFFSET = { left: 0, top: 8 };

export const MoreActionsPopover: React.FC<{
    toolbarSlot: ToolbarSlot;
}> = ({ toolbarSlot }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const portalPosition = direction === TextDirection.RightToLeft ? Position.BottomLeft : Position.BottomRight;
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
        SwitchViewModeMenuItem,
        SwitchThemeMenuItem,
    } = toolbarSlot;

    const renderTarget = (toggle: Toggle, opened: boolean): React.ReactElement => {
        const label = l10n && l10n.toolbar ? ((l10n.toolbar as LocalizationMap).moreActions as string) : 'More actions';

        return (
            <Tooltip
                ariaControlsSuffix="toolbar-more-actions"
                position={portalPosition}
                target={
                    <MinimalButton
                        ariaLabel={label}
                        isSelected={opened}
                        testId="toolbar__more-actions-popover-target"
                        onClick={toggle}
                    >
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
                <SwitchScrollModeMenuItem mode={ScrollMode.Page} onClick={toggle} />
                <SwitchScrollModeMenuItem mode={ScrollMode.Vertical} onClick={toggle} />
                <SwitchScrollModeMenuItem mode={ScrollMode.Horizontal} onClick={toggle} />
                <SwitchScrollModeMenuItem mode={ScrollMode.Wrapped} onClick={toggle} />
                <MenuDivider />
                <div className="rpv-core__display--hidden rpv-core__display--block-small">
                    <SwitchViewModeMenuItem mode={ViewMode.SinglePage} onClick={toggle} />
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-small">
                    <SwitchViewModeMenuItem mode={ViewMode.DualPage} onClick={toggle} />
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-small">
                    <SwitchViewModeMenuItem mode={ViewMode.DualPageWithCover} onClick={toggle} />
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-small">
                    <MenuDivider />
                </div>
                <ShowPropertiesMenuItem onClick={toggle} />
            </Menu>
        );
    };

    return (
        <Popover
            ariaControlsSuffix="toolbar-more-actions"
            ariaHasPopup="menu"
            position={portalPosition}
            target={renderTarget}
            content={renderContent}
            offset={PORTAL_OFFSET}
            closeOnClickOutside={true}
            closeOnEscape={true}
        />
    );
};
