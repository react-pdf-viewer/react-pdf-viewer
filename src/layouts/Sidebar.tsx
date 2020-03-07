/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import AttachmentLoader from '../attachment/AttachmentLoader';
import BookmarkLoader from '../bookmark/BookmarkLoader';
import Button from '../components/Button';
import BookmarkIcon from '../icons/BookmarkIcon';
import FileIcon from '../icons/FileIcon';
import WrappedScrollingIcon from '../icons/WrappedScrollingIcon';
import LocalizationContext from '../localization/LocalizationContext';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContent from '../theme/ThemeContext';
import ThumbnailList from '../thumbnail/ThumbnailList';
import classNames from '../utils/classNames';
import PdfJs from '../vendors/PdfJs';
import './sidebar.less';

interface SidebarProps {
    currentPage: number;
    doc: PdfJs.PdfDocument;
    height: number;
    rotation: number;
    width: number;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
    onJumpToPage(pageIndex: number): void;
}

enum Tab {
    Attachment = 'Attachment',
    Bookmark = 'Bookmark',
    Thumbnail = 'Thumbnail',
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const Sidebar: React.FC<SidebarProps> = ({ currentPage, doc, height, rotation, width, onJumpToDest, onJumpToPage }) => {
    const l10n = React.useContext(LocalizationContext);
    const theme = React.useContext(ThemeContent);
    const [tab, setTab] = React.useState(Tab.Thumbnail);
    const clickThumbnailTab = () => setTab(Tab.Thumbnail);
    const clickBookmarkTab = () => setTab(Tab.Bookmark);
    const clickAttachmentTab = () => setTab(Tab.Attachment);

    const renderAttachmentTip = () => l10n.sidebar.attachment;
    const renderBookmarkTip = () => l10n.sidebar.bookmark;
    const renderThumbnailTip = () => l10n.sidebar.thumbnail;

    return (
        <div className={`${theme.prefixClass}-sidebar`}>
            <div className={`${theme.prefixClass}-sidebar-tabs`}>
                <div className={`${theme.prefixClass}-sidebar-tab`}>
                    <Tooltip
                        position={Position.BottomCenter}
                        target={(
                            <Button onClick={clickThumbnailTab} isSelected={tab === Tab.Thumbnail}>
                                <WrappedScrollingIcon />
                            </Button>
                        )}
                        content={renderThumbnailTip}
                        offset={TOOLTIP_OFFSET}
                    />
                </div>
                <div className={`${theme.prefixClass}-sidebar-tab`}>
                    <Tooltip
                        position={Position.BottomCenter}
                        target={(
                            <Button onClick={clickBookmarkTab} isSelected={tab === Tab.Bookmark}>
                                <BookmarkIcon />
                            </Button>
                        )}
                        content={renderBookmarkTip}
                        offset={TOOLTIP_OFFSET}
                    />
                </div>
                <div className={`${theme.prefixClass}-sidebar-tab`}>
                    <Tooltip
                        position={Position.BottomCenter}
                        target={(
                            <Button onClick={clickAttachmentTab} isSelected={tab === Tab.Attachment}>
                                <FileIcon />
                            </Button>
                        )}
                        content={renderAttachmentTip}
                        offset={TOOLTIP_OFFSET}
                    />
                </div>
            </div>
            <div
                className={
                    classNames({
                        [`${theme.prefixClass}-sidebar-content`]: true,
                        [`${theme.prefixClass}-sidebar-thumbnails`]: tab === Tab.Thumbnail,
                    })
                }
            >
                {
                    tab === Tab.Thumbnail && (
                        <ThumbnailList
                            currentPage={currentPage}
                            doc={doc}
                            pageHeight={height}
                            pageWidth={width}
                            rotation={rotation}
                            onJumpToPage={onJumpToPage}
                        />
                    )
                }
                {
                    tab === Tab.Bookmark && <BookmarkLoader doc={doc} onJumpToDest={onJumpToDest} />
                }
                {
                    tab === Tab.Attachment && <AttachmentLoader doc={doc} />
                }
            </div>
        </div>
    );
};

export default Sidebar;
