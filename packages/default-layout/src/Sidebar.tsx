/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import {
    LocalizationContext,
    MinimalButton,
    Position,
    Splitter,
    TextDirection,
    ThemeContext,
    Tooltip,
    classNames,
    type LocalizationMap,
    type SplitterSize,
    type Store,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { BookmarkIcon } from './BookmarkIcon';
import { FileIcon } from './FileIcon';
import { ThumbnailIcon } from './ThumbnailIcon';
import { type StoreProps } from './types/StoreProps';

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
    const containerRef = React.useRef<HTMLDivElement>();
    const { l10n } = React.useContext(LocalizationContext);
    const [opened, setOpened] = React.useState(store.get('isCurrentTabOpened') || false);
    const [currentTab, setCurrentTab] = React.useState(Math.max(store.get('currentTab') || 0, 0));
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const resizeConstrain = (size: SplitterSize) => size.firstHalfPercentage >= 20 && size.firstHalfPercentage <= 80;

    const defaultTabs: SidebarTab[] = [
        {
            content: thumbnailTabContent,
            icon: <ThumbnailIcon />,
            title:
                l10n && l10n.defaultLayout
                    ? ((l10n.defaultLayout as LocalizationMap).thumbnail as string)
                    : 'Thumbnail',
        },
        {
            content: bookmarkTabContent,
            icon: <BookmarkIcon />,
            title:
                l10n && l10n.defaultLayout ? ((l10n.defaultLayout as LocalizationMap).bookmark as string) : 'Bookmark',
        },
        {
            content: attachmentTabContent,
            icon: <FileIcon />,
            title:
                l10n && l10n.defaultLayout
                    ? ((l10n.defaultLayout as LocalizationMap).attachment as string)
                    : 'Attachment',
        },
    ];

    const listTabs = tabs ? tabs(defaultTabs) : defaultTabs;

    const toggleTab = (index: number) => {
        if (currentTab === index) {
            store.update('isCurrentTabOpened', !store.get('isCurrentTabOpened'));
            // Remove the `width` style in the case the sidebar is resized
            const container = containerRef.current;
            if (container) {
                const width = container.style.width;
                if (width) {
                    container.style.removeProperty('width');
                }
            }
        } else {
            store.update('currentTab', index);
        }
    };

    const switchToTab = (index: number) => {
        if (index >= 0 && index <= listTabs.length - 1) {
            store.update('isCurrentTabOpened', true);
            setCurrentTab(index);
        }
    };

    const handleCurrentTabOpened = (opened: boolean) => {
        setOpened(opened);
    };

    React.useEffect(() => {
        store.subscribe('currentTab', switchToTab);
        store.subscribe('isCurrentTabOpened', handleCurrentTabOpened);

        return (): void => {
            store.unsubscribe('currentTab', switchToTab);
            store.unsubscribe('isCurrentTabOpened', handleCurrentTabOpened);
        };
    }, []);

    if (listTabs.length === 0) {
        return <></>;
    }

    return (
        <>
            <div
                data-testid="default-layout__sidebar"
                className={classNames({
                    'rpv-default-layout__sidebar': true,
                    'rpv-default-layout__sidebar--opened': opened,
                    'rpv-default-layout__sidebar--ltr': !isRtl,
                    'rpv-default-layout__sidebar--rtl': isRtl,
                })}
                ref={containerRef}
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
                        className={classNames({
                            'rpv-default-layout__sidebar-content': true,
                            'rpv-default-layout__sidebar-content--opened': opened,
                            'rpv-default-layout__sidebar-content--ltr': !isRtl,
                            'rpv-default-layout__sidebar-content--rtl': isRtl,
                        })}
                        role="tabpanel"
                        tabIndex={-1}
                    >
                        {listTabs[currentTab].content}
                    </div>
                </div>
            </div>
            {opened && <Splitter constrain={resizeConstrain} />}
        </>
    );
};
