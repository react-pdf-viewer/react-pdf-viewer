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
    MenuItem,
    MinimalButton,
    Popover,
    Position,
    SpecialZoomLevel,
} from '@react-pdf-viewer/core';
import type { LocalizationMap, Toggle } from '@react-pdf-viewer/core';

import type { RenderZoomProps } from './types/RenderZoomProps';

const LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
const PORTAL_OFFSET = { left: 0, top: 8 };

export const ZoomPopover: React.FC<RenderZoomProps> = ({ scale, onZoom }) => {
    const { l10n } = React.useContext(LocalizationContext);

    const getSpcialLevelLabel = (level: SpecialZoomLevel): string | LocalizationMap => {
        switch (level) {
            case SpecialZoomLevel.ActualSize:
                return l10n && l10n.zoom ? l10n.zoom.actualSize : 'Actual size';
            case SpecialZoomLevel.PageFit:
                return l10n && l10n.zoom ? l10n.zoom.pageFit : 'Page fit';
            case SpecialZoomLevel.PageWidth:
                return l10n && l10n.zoom ? l10n.zoom.pageWidth : 'Page width';
        }
    };
    const zoomDocumentLabel = l10n && l10n.zoom ? l10n.zoom.zoomDocument : 'Zoom document';

    const renderTarget = (toggle: Toggle): React.ReactElement => {
        const click = (): void => {
            toggle();
        };
        return (
            <MinimalButton ariaLabel={zoomDocumentLabel as string} onClick={click}>
                <span className="rpv-zoom__popover-target">
                    <span className="rpv-zoom__popover-target-scale" data-testid="zoom__popover-target-scale">
                        {Math.round(scale * 100)}%
                    </span>
                    <span className="rpv-zoom__popover-target-arrow" />
                </span>
            </MinimalButton>
        );
    };

    const renderContent = (toggle: Toggle): React.ReactElement => (
        <Menu>
            {Object.keys(SpecialZoomLevel).map((k) => {
                const level = k as SpecialZoomLevel;
                const clickMenuItem = (): void => {
                    toggle();
                    onZoom(level);
                };
                return (
                    <MenuItem key={level} onClick={clickMenuItem}>
                        {getSpcialLevelLabel(level)}
                    </MenuItem>
                );
            })}
            <MenuDivider />
            {LEVELS.map((level) => {
                const clickMenuItem = (): void => {
                    toggle();
                    onZoom(level);
                };
                return (
                    <MenuItem key={level} onClick={clickMenuItem}>
                        {`${Math.round(level * 100)}%`}
                    </MenuItem>
                );
            })}
        </Menu>
    );

    return (
        <Popover
            ariaControlsSuffix="zoom"
            ariaHasPopup="menu"
            position={Position.BottomCenter}
            target={renderTarget}
            content={renderContent}
            offset={PORTAL_OFFSET}
            closeOnClickOutside={true}
            closeOnEscape={true}
        />
    );
};
