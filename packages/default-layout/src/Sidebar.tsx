/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import BookmarkIcon from './BookmarkIcon';
import FileIcon from './FileIcon';
import ThumbnailIcon from './ThumbnailIcon';

export interface SidebarTab {
    content: React.ReactElement;
    icon: React.ReactElement;
    title: React.ReactElement;
}

interface SidebarProps {
    attachmentTabContent: React.ReactElement;
    bookmarkTabContent: React.ReactElement;
    thumbnailTabContent: React.ReactElement;
    tabs?: (defaultTabs: SidebarTab[]) => SidebarTab[];
}

const TOOLTIP_OFFSET = { left: 8, top: 0 };

const Sidebar: React.FC<SidebarProps> = ({ attachmentTabContent, bookmarkTabContent, thumbnailTabContent, tabs }) => {
    const l10n = React.useContext(LocalizationContext);
    const [opened, setOpened] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState(0);

    const defaultTabs: SidebarTab[] = [
        {
            content: thumbnailTabContent,
            icon: <ThumbnailIcon />,
            title: <>{(l10n && l10n.defaultLayout ? l10n.defaultLayout.thumbnail : 'Thumbnail')}</>,
        },
        {
            content: bookmarkTabContent,
            icon: <BookmarkIcon />,
            title: <>{l10n && l10n.defaultLayout ? l10n.defaultLayout.bookmark : 'Bookmark'}</>,
        },
        {
            content: attachmentTabContent,
            icon: <FileIcon />,
            title: <>{l10n && l10n.defaultLayout ? l10n.defaultLayout.attachment : 'Attachment'}</>,
        },
    ];

    const listTabs = tabs ? tabs(defaultTabs) : defaultTabs;

    const switchToTab = (index: number) => {
        if (currentTab === index) {
            // Toggle the current tab
            setOpened(isOpened => !isOpened);
        } else {
            setOpened(true);
            setCurrentTab(index);
        }
    };

    return (
        <div className={`rpv-default-layout-sidebar ${opened ? 'rpv-default-layout-sidebar-opened' : ''}`}>
            <div className='rpv-default-layout-sidebar-tabs'>
                <div className='rpv-default-layout-sidebar-headers'>
                    {
                        listTabs.map((tab, index) => (
                            <div key={index} className='rpv-default-layout-sidebar-header'>
                                <Tooltip
                                    position={Position.RightCenter}
                                    target={(
                                        <Button onClick={() => switchToTab(index)} isSelected={currentTab === index}>
                                            {tab.icon}
                                        </Button>
                                    )}
                                    content={() => tab.title}
                                    offset={TOOLTIP_OFFSET}
                                />
                            </div>
                        ))
                    }
                </div>
                <div className={`rpv-default-layout-sidebar-content ${opened ? 'rpv-default-layout-sidebar-content-opened' : ''}`}>
                    {listTabs[currentTab].content}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
