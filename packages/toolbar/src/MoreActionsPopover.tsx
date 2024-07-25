/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import {
    Breakpoint,
    BreakpointContext,
    LocalizationContext,
    Menu,
    MenuDivider,
    MinimalButton,
    Popover,
    Position,
    ScrollMode,
    Tooltip,
    ViewMode,
    type LocalizationMap,
    type Toggle,
} from '@react-pdf-viewer/core';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';
import * as React from 'react';
import { MoreIcon } from './MoreIcon';
import { type ToolbarSlot } from './types/ToolbarSlot';

export const MoreActionsPopover: React.FC<{
    toolbarSlot: ToolbarSlot;
}> = ({ toolbarSlot }) => {
    const breakpoint = React.useContext(BreakpointContext);
    const isSmallBreakpoint = breakpoint === Breakpoint.ExtraSmall || breakpoint === Breakpoint.Small;
    const { l10n } = React.useContext(LocalizationContext);
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
                position={Position.BottomCenter}
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
            />
        );
    };

    const renderContent = (toggle: Toggle): React.ReactElement => {
        return (
            <Menu>
                {/* These items will be hidden on the larger screens */}
                {isSmallBreakpoint && (
                    <>
                        <SwitchThemeMenuItem onClick={toggle} />
                        <EnterFullScreenMenuItem onClick={toggle} />
                        <OpenMenuItem />
                        <PrintMenuItem onClick={toggle} />
                        <DownloadMenuItem onClick={toggle} />
                        <MenuDivider />
                    </>
                )}
                <GoToFirstPageMenuItem onClick={toggle} />
                {isSmallBreakpoint && (
                    <>
                        <GoToPreviousPageMenuItem onClick={toggle} />
                        <GoToNextPageMenuItem onClick={toggle} />
                    </>
                )}
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
                {!isSmallBreakpoint && (
                    <>
                        <SwitchViewModeMenuItem mode={ViewMode.SinglePage} onClick={toggle} />
                        <SwitchViewModeMenuItem mode={ViewMode.DualPage} onClick={toggle} />
                        <SwitchViewModeMenuItem mode={ViewMode.DualPageWithCover} onClick={toggle} />
                        <MenuDivider />
                    </>
                )}
                <ShowPropertiesMenuItem onClick={toggle} />
            </Menu>
        );
    };

    return (
        <Popover
            ariaControlsSuffix="toolbar-more-actions"
            ariaHasPopup="menu"
            position={Position.BottomCenter}
            target={renderTarget}
            content={renderContent}
            closeOnClickOutside={true}
            closeOnEscape={true}
        />
    );
};
