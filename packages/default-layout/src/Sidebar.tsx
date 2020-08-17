/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement, useContext, useState } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import BookmarkIcon from './BookmarkIcon';
import FileIcon from './FileIcon';
import ThumbnailIcon from './ThumbnailIcon';

interface SidebarProps {
    tabContents: (() => ReactElement)[];
}

const TOOLTIP_OFFSET = { left: 8, top: 0 };

const Sidebar: React.FC<SidebarProps> = ({ tabContents }) => {
    const l10n = useContext(LocalizationContext);
    const [opened, setOpened] = useState(false);
    const [tab, setTab] = useState(0);

    const switchToTab = (index: number) => {
        if (tab === index) {
            // Toggle the current tab
            setOpened(isOpened => !isOpened);
        } else {
            setOpened(true);
            setTab(index);
        }
    };

    return (
        <div className={`rpv-default-layout-sidebar ${opened ? 'rpv-default-layout-sidebar-opened' : ''}`}>
            <div className='rpv-default-layout-sidebar-tabs'>
                <div className='rpv-default-layout-sidebar-headers'>
                    <div className='rpv-default-layout-sidebar-header'>
                        <Tooltip
                            position={Position.RightCenter}
                            target={(
                                <Button onClick={() => switchToTab(0)} isSelected={tab === 0}>
                                    <ThumbnailIcon />
                                </Button>
                            )}
                            content={() =>
                                l10n && l10n.defaultLayoutPlugin ? l10n.defaultLayoutPlugin.thumbnail : 'Thumbnail'
                            }
                            offset={TOOLTIP_OFFSET}
                        />
                    </div>
                    <div className='rpv-default-layout-sidebar-header'>
                        <Tooltip
                            position={Position.RightCenter}
                            target={(
                                <Button onClick={() => switchToTab(1)} isSelected={tab === 1}>
                                    <BookmarkIcon />
                                </Button>
                            )}
                            content={() =>
                                l10n && l10n.defaultLayoutPlugin ? l10n.defaultLayoutPlugin.bookmark : 'Bookmark'
                            }
                            offset={TOOLTIP_OFFSET}
                        />
                    </div>
                    <div className='rpv-default-layout-sidebar-header'>
                        <Tooltip
                            position={Position.RightCenter}
                            target={(
                                <Button onClick={() => switchToTab(2)} isSelected={tab === 2}>
                                    <FileIcon />
                                </Button>
                            )}
                            content={() => 
                                l10n && l10n.defaultLayoutPlugin ? l10n.defaultLayoutPlugin.attachment : 'Attachment'
                            }
                            offset={TOOLTIP_OFFSET}
                        />
                    </div>
                </div>
                <div className={`rpv-default-layout-sidebar-content ${opened ? 'rpv-default-layout-sidebar-content-opened' : ''}`}>
                    { tabContents && tabContents[tab] ? tabContents[tab]() : <></>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
