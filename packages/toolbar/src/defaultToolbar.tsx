/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import MoreActionsPopover from './MoreActionsPopover';
import ToolbarSlot from './ToolbarSlot';

const defaultToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {
    const {
        CurrentPageInput, Download, EnterFullScreen, GoToNextPage, GoToPreviousPage,
        NumberOfPages, Open, Print, ShowSearchPopover, Zoom, ZoomIn,
        ZoomOut,
    } = toolbarSlot;

    return (
        <div className='rpv-toolbar'>
            <div className='rpv-toolbar-left'>
                <div className='rpv-toolbar-item'>
                    <ShowSearchPopover />
                </div>
                <div className="rpv-core-display-hidden rpv-core-display-block-medium">
                    <div className='rpv-toolbar-item'>
                        <GoToPreviousPage />
                    </div>
                </div>
                <div className='rpv-toolbar-item'>
                    <CurrentPageInput /> / <NumberOfPages />
                </div>
                <div className="rpv-core-display-hidden rpv-core-display-block-medium">
                    <div className='rpv-toolbar-item'>
                        <GoToNextPage />
                    </div>
                </div>
            </div>
            <div className='rpv-toolbar-center'>
                <div className='rpv-toolbar-item'>
                    <ZoomOut />
                </div>
                <div className="rpv-core-display-hidden rpv-core-display-block-medium">
                    <div className='rpv-toolbar-item'>
                        <Zoom />
                    </div>
                </div>
                <div className='rpv-toolbar-item'>
                    <ZoomIn />
                </div>
            </div>
            <div className='rpv-toolbar-right'>
                <div className="rpv-core-display-hidden rpv-core-display-block-medium">
                    <div className='rpv-toolbar-item'>
                        <EnterFullScreen />
                    </div>
                </div>
                <div className="rpv-core-display-hidden rpv-core-display-block-medium">
                    <div className='rpv-toolbar-item'>
                        <Open />
                    </div>
                </div>
                <div className="rpv-core-display-hidden rpv-core-display-block-medium">
                    <div className='rpv-toolbar-item'>
                        <Download />
                    </div>
                </div>
                <div className="rpv-core-display-hidden rpv-core-display-block-medium">
                    <div className='rpv-toolbar-item'>
                        <Print />
                    </div>
                </div>
                <div className='rpv-toolbar-item'>
                    <MoreActionsPopover toolbarSlot={toolbarSlot} />
                </div>
            </div>
        </div>
    );
};

export default defaultToolbar;
