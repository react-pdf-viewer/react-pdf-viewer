/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import Menu from '../components/Menu';
import MenuDivider from '../components/MenuDivider';
import MenuItem from '../components/MenuItem';
import { Toggle } from '../hooks/useToggle';
import LocalizationContext from '../localization/LocalizationContext';
import LocalizationMap from '../localization/LocalizationMap';
import Popover from '../portal/Popover';
import Position from '../portal/Position';
import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContext from '../theme/ThemeContext';
import './zoomPopover.less';

interface ZoomPopoverProps {
    scale: number;
    onZoom(scale: number | SpecialZoomLevel): void;
}

const LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
const PORTAL_OFFSET = { left: 0, top: 8 };

const ZoomPopover: React.FC<ZoomPopoverProps> = ({ scale, onZoom }) => {
    const l10n = useContext(LocalizationContext);
    const theme = useContext(ThemeContext);

    const getSpcialLevelLabel = (level: SpecialZoomLevel): LocalizationMap => {
        switch (level) {
            case SpecialZoomLevel.ActualSize: return l10n.zoom.actualSize;
            case SpecialZoomLevel.PageFit: return l10n.zoom.pageFit;
            case SpecialZoomLevel.PageWidth: return l10n.zoom.pageWidth;
        }
    };

    const renderTarget = (toggle: Toggle): React.ReactElement => {
        const click = (): void => { toggle(); };
        return (
            <span className={`${theme.prefixClass}-zoom-popover-target`} onClick={click}>
                <span className={`${theme.prefixClass}-zoom-popover-target-scale`}>{Math.round(scale * 100)}%</span>
                <span className={`${theme.prefixClass}-zoom-popover-target-arrow`} />
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
