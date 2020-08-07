/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement, useContext, useState } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@phuocng/rpv';

import BookmarkIcon from './BookmarkIcon';
import FileIcon from './FileIcon';
import ThumbnailIcon from './ThumbnailIcon';
import './sidebar.less';

interface SidebarProps {
    tabContents: (() => ReactElement)[];
}

const TOOLTIP_OFFSET = { left: 8, top: 0 };

const Sidebar: React.FC<SidebarProps> = ({ tabContents }) => {
    const l10n = useContext(LocalizationContext);
    const [tab, setTab] = useState(0);

    return (
        <div className='rpv-default-layout-sidebar-tabs'>
            <div className='rpv-default-layout-sidebar-headers'>
                <div className='rpv-default-layout-sidebar-header'>
                    <Tooltip
                        position={Position.RightCenter}
                        target={(
                            <Button onClick={() => setTab(0)} isSelected={tab === 0}>
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
                            <Button onClick={() => setTab(1)} isSelected={tab === 1}>
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
                            <Button onClick={() => setTab(2)} isSelected={tab === 2}>
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
            <div className='rpv-default-layout-sidebar-content'>
                { tabContents && tabContents[tab] ? tabContents[tab]() : <></>}
            </div>
        </div>
    );
};

export default Sidebar;
