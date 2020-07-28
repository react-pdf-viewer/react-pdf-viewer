/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useState } from 'react';

import Button from '../components/Button';
import HandToolIcon from '../icons/HandToolIcon';
import LeftSidebarIcon from '../icons/LeftSidebarIcon';
import TextSelectionIcon from '../icons/TextSelectionIcon';
import { RenderToolbarSlot } from './ToolbarSlot';
import LocalizationContext from '../localization/LocalizationContext';
import LocalizationMap from '../localization/LocalizationMap';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import Match from '../search/Match';
import SearchPopover from '../search/SearchPopover';
import SelectionMode from '../SelectionMode';
import PdfJs from '../vendors/PdfJs';
import MoreActionsPopover from './MoreActionsPopover';

interface ToolbarProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    renderToolbar: RenderToolbarSlot;
    selectionMode: SelectionMode;
    onChangeSelectionMode(mode: SelectionMode): void;
    onJumpToMatch(match: Match): void;
    onSearchFor(keyword: RegExp): void;
    onToggleSidebar(): void;
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const Toolbar: React.FC<ToolbarProps> = ({
    doc, fileName, selectionMode,
    onChangeSelectionMode,
    onJumpToMatch, onSearchFor, onToggleSidebar,
    renderToolbar,
}) => {
    const l10n = useContext(LocalizationContext);
    const [isSidebarOpened, setSidebarOpened] = useState(false);

    const toggleSidebar = (): void => {
        setSidebarOpened(!isSidebarOpened);
        onToggleSidebar();
    };

    const renderToggle = (): LocalizationMap => l10n.toolbar.toggleSidebar;

    return renderToolbar({
        moreActionsPopover: (
            <MoreActionsPopover
                doc={doc}
                fileName={fileName}
                selectionMode={selectionMode}
                onChangeSelectionMode={onChangeSelectionMode}
            />
        ),
        searchPopover: (
            <SearchPopover doc={doc} onJumpToMatch={onJumpToMatch} onSearchFor={onSearchFor} />
        ),
        toggleSidebarButton: (
            <Tooltip
                position={Position.BottomLeft}
                target={(
                    <Button onClick={toggleSidebar} isSelected={isSidebarOpened}>
                        <LeftSidebarIcon />
                    </Button>
                )}
                content={renderToggle}
                offset={TOOLTIP_OFFSET}
            />
        ),
    });
};

export default Toolbar;
