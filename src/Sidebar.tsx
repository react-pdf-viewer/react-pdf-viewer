/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import AttachmentLoader from './attachment/AttachmentLoader';
import BookmarkLoader from './bookmark/BookmarkLoader';
import Button from './Button';
import BookmarkIcon from './icons/BookmarkIcon';
import FileIcon from './icons/FileIcon';
import WrappedScrollingIcon from './icons/WrappedScrollingIcon';
import LocalizationContext from './localization/LocalizationContext';
import PdfJs from './PdfJs';
import Position from './portal/Position';
import Tooltip from './portal/Tooltip';
import ThumbnailList from './thumbnail/ThumbnailList';
import { SpecialLevel } from './zoom/zoomingLevel';

interface SidebarProps {
    currentPage: number;
    doc: PdfJs.PdfDocument;
    height: number;
    rotation: number;
    width: number;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialLevel): void;
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
    const [tab, setTab] = React.useState(Tab.Thumbnail);
    const clickThumbnailTab = () => setTab(Tab.Thumbnail);
    const clickBookmarkTab = () => setTab(Tab.Bookmark);
    const clickAttachmentTab = () => setTab(Tab.Attachment);

    const renderAttachmentTip = () => (<div style={{ padding: '8px' }}>{l10n.sidebar.attachment}</div>);
    const renderBookmarkTip = () => (<div style={{ padding: '8px' }}>{l10n.sidebar.bookmark}</div>);
    const renderThumbnailTip = () => (<div style={{ padding: '8px' }}>{l10n.sidebar.thumbnail}</div>);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#EEE',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '4px',
                }}
            >
                <div style={{ padding: '0 2px' }}>
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
                <div style={{ padding: '0 2px' }}>
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
                <div style={{ padding: '0 2px' }}>
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
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexGrow: 1,
                    flexShrink: 1,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    overflow: 'scroll',
                    padding: '8px 0',
                }}
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
