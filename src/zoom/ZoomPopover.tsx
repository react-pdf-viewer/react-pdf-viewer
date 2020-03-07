/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Menu from '../menu/Menu';
import { Toggle } from '../hooks/useToggle';
import LocalizationContext from '../localization/LocalizationContext';
import MenuDivider from '../menu/MenuDivider';
import MenuItem from '../menu/MenuItem';
import Popover from '../portal/Popover';
import Position from '../portal/Position';
import ThemeContent from '../theme/ThemeContext';
import { SpecialLevel } from './zoomingLevel';
import './zoomPopover.less';

interface ZoomPopoverProps {
    scale: number;
    onZoom(scale: number | SpecialLevel): void;
}

const LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
const PORTAL_OFFSET = { left: 0, top: 8 };

const ZoomPopover: React.FC<ZoomPopoverProps> = ({ scale, onZoom }) => {
    const l10n = React.useContext(LocalizationContext);
    const theme = React.useContext(ThemeContent);

    const getSpcialLevelLabel = (level: string) => {
        switch (level) {
            case SpecialLevel.ActualSize: return l10n.zoom.actualSize;
            case SpecialLevel.PageFit: return l10n.zoom.pageFit;
            case SpecialLevel.PageWidth: return l10n.zoom.pageWidth;
        }
    };

    const renderTarget = (toggle: Toggle) => {
        const click = () => { toggle(); };
        return (
            <span className={`${theme.prefixClass}-zoom-popover-target`} onClick={click}>
                <span className={`${theme.prefixClass}-zoom-popover-target-scale`}>{Math.round(scale * 100)}%</span>
                <span className={`${theme.prefixClass}-zoom-popover-target-arrow`} />
            </span>
        );
    };

    const renderContent = (toggle: Toggle) => (
        <div className={`${theme.prefixClass}-zoom-popover-content`}>
            <Menu>
                {
                    Object.keys(SpecialLevel).map((k) => {
                        const level = k as SpecialLevel;
                        const clickMenuItem = () => { toggle(); onZoom(level); };
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
                        const clickMenuItem = () => { toggle(); onZoom(level); };
                        return (
                            <MenuItem key={level} onClick={clickMenuItem}>
                                {`${Math.round(level * 100)}%`}
                            </MenuItem>
                        );
                    })
                }
            </Menu>
        </div>
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
