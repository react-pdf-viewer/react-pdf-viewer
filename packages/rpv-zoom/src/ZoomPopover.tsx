/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { LocalizationContext, LocalizationMap, Menu, MenuDivider, MenuItem, Popover, Position, SpecialZoomLevel, Toggle } from '@phuocng/rpv';

import { RenderZoomProps } from './Zoom';
import './zoomPopover.less';

const LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
const PORTAL_OFFSET = { left: 0, top: 8 };

const ZoomPopover: React.FC<RenderZoomProps> = ({ scale, onZoom }) => {
    const l10n = useContext(LocalizationContext);

    const getSpcialLevelLabel = (level: SpecialZoomLevel): string | LocalizationMap => {
        switch (level) {
            case SpecialZoomLevel.ActualSize:
                return (l10n && l10n.plugins && l10n.plugins.zoom) ? l10n.plugins.zoom.actualSize : 'Actual size';
            case SpecialZoomLevel.PageFit:
                return (l10n && l10n.plugins && l10n.plugins.zoom) ? l10n.plugins.zoom.pageFit : 'Page fit';
            case SpecialZoomLevel.PageWidth:
                return (l10n && l10n.plugins && l10n.plugins.zoom) ? l10n.plugins.zoom.pageWidth : 'Page width';
        }
    };

    const renderTarget = (toggle: Toggle): React.ReactElement => {
        const click = (): void => { toggle(); };
        return (
            <span className='rpv-zoom-popover-target' onClick={click}>
                <span className='rpv-zoom-popover-target-scale'>{Math.round(scale * 100)}%</span>
                <span className='rpv-zoom-popover-target-arrow' />
            </span>
        );
    };

    const renderContent = (toggle: Toggle): React.ReactElement => (
        <Menu>
            {
                Object.keys(SpecialZoomLevel).map((k) => {
                    const level = k as SpecialZoomLevel;
                    const clickMenuItem = (): void => { toggle(); onZoom(level); };
                    return (
                        <MenuItem key={level} onClick={clickMenuItem}>
                            {getSpcialLevelLabel(level)}
                        </MenuItem>
                    );
                })
            }
            <MenuDivider />
            {
                LEVELS.map((level) => {
                    const clickMenuItem = (): void => { toggle(); onZoom(level); };
                    return (
                        <MenuItem key={level} onClick={clickMenuItem}>
                            {`${Math.round(level * 100)}%`}
                        </MenuItem>
                    );
                })
            }
        </Menu>
    );

    return (
        <Popover
            position={Position.BottomCenter}
            target={renderTarget}
            content={renderContent}
            offset={PORTAL_OFFSET}
            closeOnClickOutside={true}
            closeOnEscape={true}
        />
    );
};

export default ZoomPopover;
