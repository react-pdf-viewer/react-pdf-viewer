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
    const {
        CurrentPageInput, Download, EnterFullScreen,
        GoToFirstPage, GoToLastPage, GoToNextPage, GoToPreviousPage,
        NumberOfPages, Open, Print, Zoom, ZoomIn, ZoomOut,
    } = toolbarSlot;

    return (
        <div className='rpv-toolbar'>
            <div className='rpv-toolbar-left'>
                <div className='rpv-toolbar-item'>
                    <GoToFirstPage />
                </div>
                <div className='rpv-toolbar-item'>
                    <GoToPreviousPage />
                </div>
                <div className='rpv-toolbar-item'>
                    <CurrentPageInput /> / <NumberOfPages />
                </div>
                <div className='rpv-toolbar-item'>
                    <GoToNextPage />
                </div>
                <div className='rpv-toolbar-item'>
                    <GoToLastPage />
                </div>
            </div>
            <div className='rpv-toolbar-center'>
                <div className='rpv-toolbar-item'>
                    <ZoomOut />
                </div>
                <div className='rpv-toolbar-item'>
                    <Zoom />
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
