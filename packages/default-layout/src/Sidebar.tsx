/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { classNames, LocalizationContext, MinimalButton, Position, TextDirection, ThemeContext, Tooltip } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import { BookmarkIcon } from './BookmarkIcon';
import { FileIcon } from './FileIcon';
import { ThumbnailIcon } from './ThumbnailIcon';
import type { StoreProps } from './types/StoreProps';

export interface SidebarTab {
    content: React.ReactElement;
    icon: React.ReactElement;
    title: string;
}

interface SidebarProps {
    attachmentTabContent: React.ReactElement;
    bookmarkTabContent: React.ReactElement;
    store: Store<StoreProps>;
    thumbnailTabContent: React.ReactElement;
    tabs?: (defaultTabs: SidebarTab[]) => SidebarTab[];
}

const TOOLTIP_OFFSET_LTR = { left: 8, top: 0 };
const TOOLTIP_OFFSET_RTL = { left: -8, top: 0 };

export const Sidebar: React.FC<SidebarProps> = ({
    attachmentTabContent,
    bookmarkTabContent,
    store,
    thumbnailTabContent,
    tabs,
}) => {
    const { l10n } = React.useContext(LocalizationContext);    
    const [opened, setOpened] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState(store.get('currentTab') || 0);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const defaultTabs: SidebarTab[] = [
        {
            content: thumbnailTabContent,
            icon: <ThumbnailIcon />,
            title: (l10n && l10n.defaultLayout ? l10n.defaultLayout.thumbnail : 'Thumbnail') as string,
        },
        {
            content: bookmarkTabContent,
            icon: <BookmarkIcon />,
            title: (l10n && l10n.defaultLayout ? l10n.defaultLayout.bookmark : 'Bookmark') as string,
        },
        {
            content: attachmentTabContent,
            icon: <FileIcon />,
            title: (l10n && l10n.defaultLayout ? l10n.defaultLayout.attachment : 'Attachment') as string,
        },
    ];

    const listTabs = tabs ? tabs(defaultTabs) : defaultTabs;

    const toggleTab = (index: number) => {
        currentTab === index
            ? setOpened((isOpened) => !isOpened)
            : switchToTab(index);
    };

    const switchToTab = (index: number) => {
        setOpened(true);
        setCurrentTab(index);
    };

    React.useEffect(() => {
        store.subscribe('currentTab', switchToTab);

        return (): void => {
            store.unsubscribe('currentTab', switchToTab);
        };
    }, []);

    return (
        <div
            className={
                classNames({
                    'rpv-default-layout__sidebar': true,
                    'rpv-default-layout__sidebar--opened': opened,
                    'rpv-default-layout__sidebar--ltr': !isRtl,
                    'rpv-default-layout__sidebar--rtl': isRtl,
                })
            }
        >
            <div className="rpv-default-layout__sidebar-tabs">
                <div className="rpv-default-layout__sidebar-headers" role="tablist" aria-orientation="vertical">
                    {listTabs.map((tab, index) => (
                        <div
                            aria-controls="rpv-default-layout__sidebar-content"
                            aria-selected={currentTab === index}
                            key={index}
                            className="rpv-default-layout__sidebar-header"
                            id={`rpv-default-layout__sidebar-tab-${index}`}
                            role="tab"
                        >
                            <Tooltip
                                ariaControlsSuffix={`default-layout-sidebar-tab-${index}`}
                                position={isRtl ? Position.LeftCenter : Position.RightCenter}
                                target={
                                    <MinimalButton
                                        ariaLabel={tab.title}
                                        isSelected={currentTab === index}
                                        onClick={() => toggleTab(index)}
                                    >
                                        {tab.icon}
                                    </MinimalButton>
                                }
                                content={() => tab.title}
                                offset={isRtl ? TOOLTIP_OFFSET_RTL : TOOLTIP_OFFSET_LTR}
                            />
                        </div>
                    ))}
                </div>
                <div
                    aria-labelledby={`rpv-default-layout__sidebar-tab-${currentTab}`}
                    id="rpv-default-layout__sidebar-content"
                    className={
                        classNames({
                            'rpv-default-layout__sidebar-content': true,
                            'rpv-default-layout__sidebar-content--opened': opened,
                            'rpv-default-layout__sidebar-content--ltr': !isRtl,
                            'rpv-default-layout__sidebar-content--rtl': isRtl,
                        })
                    }
                    role="tabpanel"
                    tabIndex={-1}
                >
                    {listTabs[currentTab].content}
                </div>
            </div>
        </div>
    );
};
