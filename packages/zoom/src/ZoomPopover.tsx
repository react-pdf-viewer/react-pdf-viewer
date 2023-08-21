/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import {
    LocalizationContext,
    Menu,
    MenuDivider,
    MenuItem,
    MinimalButton,
    Popover,
    Position,
    SpecialZoomLevel,
    TextDirection,
    ThemeContext,
    classNames,
    type LocalizationMap,
    type Toggle,
} from '@react-pdf-viewer/core';
import * as React from 'react';

const DEFAULT_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
const PORTAL_OFFSET = { left: 0, top: 8 };

export const ZoomPopover: React.FC<{
    levels?: number[];
    scale: number;
    onZoom(newScale: number | SpecialZoomLevel): void;
}> = ({ levels = DEFAULT_LEVELS, scale, onZoom }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const getSpcialLevelLabel = (level: SpecialZoomLevel): string => {
        switch (level) {
            case SpecialZoomLevel.ActualSize:
                return l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).actualSize as string) : 'Actual size';
            case SpecialZoomLevel.PageFit:
                return l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).pageFit as string) : 'Page fit';
            case SpecialZoomLevel.PageWidth:
                return l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).pageWidth as string) : 'Page width';
        }
    };
    const zoomDocumentLabel =
        l10n && l10n.zoom ? ((l10n.zoom as LocalizationMap).zoomDocument as string) : 'Zoom document';

    const renderTarget = (toggle: Toggle): React.ReactElement => {
        const click = (): void => {
            toggle();
        };
        return (
            <MinimalButton ariaLabel={zoomDocumentLabel as string} testId="zoom__popover-target" onClick={click}>
                <span className="rpv-zoom__popover-target">
                    <span
                        data-testid="zoom__popover-target-scale"
                        className={classNames({
                            'rpv-zoom__popover-target-scale': true,
                            'rpv-zoom__popover-target-scale--ltr': !isRtl,
                            'rpv-zoom__popover-target-scale--rtl': isRtl,
                        })}
                    >
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
            {levels.map((level) => {
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
