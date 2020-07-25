/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import './defaultToolbar.less';
import ToolbarSlot, { RenderToolbarSlot } from './ToolbarSlot';

const defaultToolbar: RenderToolbarSlot = (toolbarSlot: ToolbarSlot): React.ReactElement => {
    const { Download, EnterFullScreen, Open, Print, ZoomIn, ZoomOut } = toolbarSlot;

    return (
        <div className='rpv-toolbar'>
            <div className='rpv-toolbar-left'>
                <div className='rpv-toolbar-item'>
                    {toolbarSlot.goToFirstPage}
                </div>
                <div className='rpv-toolbar-item'>
                    {toolbarSlot.previousPage}
                </div>
                <div className='rpv-toolbar-item'>
                    {toolbarSlot.currentPageInput} / {toolbarSlot.numberOfPages}
                </div>
                <div className='rpv-toolbar-item'>
                    {toolbarSlot.nextPage}
                </div>
                <div className='rpv-toolbar-item'>
                    {toolbarSlot.goToLastPage}
                </div>
            </div>
            <div className='rpv-toolbar-center'>
                <div className='rpv-toolbar-item'>
                    <ZoomOut />
                </div>
                <div className='rpv-toolbar-item'>
                    {toolbarSlot.zoomPopover}
                </div>
                <div className='rpv-toolbar-item'>
                    <ZoomIn />
                </div>
            </div>
            <div className='rpv-toolbar-right'>
                <div className='rpv-toolbar-item'>
                    <EnterFullScreen />
                </div>
                <div className='rpv-toolbar-item'>
                    <Open />
                </div>
                <div className='rpv-toolbar-item'>
                    <Download />
                </div>
                <div className='rpv-toolbar-item'>
                    <Print />
                </div>
            </div>
        </div>
    );
};

export default defaultToolbar;
