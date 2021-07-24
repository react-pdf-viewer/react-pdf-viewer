/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { MoreActionsPopover } from './MoreActionsPopover';
import type { ToolbarSlot } from './types/ToolbarSlot';

export const defaultToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {
    const {
        CurrentPageInput,
        Download,
        EnterFullScreen,
        GoToNextPage,
        GoToPreviousPage,
        NumberOfPages,
        Open,
        Print,
        ShowSearchPopover,
        SwitchTheme,
        Zoom,
        ZoomIn,
        ZoomOut,
    } = toolbarSlot;

    return (
        <div className="rpv-toolbar" role="toolbar" aria-orientation="horizontal">
            <div className="rpv-toolbar__left">
                <div className="rpv-toolbar__item">
                    <ShowSearchPopover />
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-small">
                    <div className="rpv-toolbar__item">
                        <GoToPreviousPage />
                    </div>
                </div>
                <div className="rpv-toolbar__item">
                    <CurrentPageInput />{' '}
                    <span className="rpv-toolbar__label">
                        / <NumberOfPages />
                    </span>
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-small">
                    <div className="rpv-toolbar__item">
                        <GoToNextPage />
                    </div>
                </div>
            </div>
            <div className="rpv-toolbar__center">
                <div className="rpv-toolbar__item">
                    <ZoomOut />
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-small">
                    <div className="rpv-toolbar__item">
                        <Zoom />
                    </div>
                </div>
                <div className="rpv-toolbar__item">
                    <ZoomIn />
                </div>
            </div>
            <div className="rpv-toolbar__right">
                <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                    <div className="rpv-toolbar__item">
                        <SwitchTheme />
                    </div>
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                    <div className="rpv-toolbar__item">
                        <EnterFullScreen />
                    </div>
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                    <div className="rpv-toolbar__item">
                        <Open />
                    </div>
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                    <div className="rpv-toolbar__item">
                        <Download />
                    </div>
                </div>
                <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                    <div className="rpv-toolbar__item">
                        <Print />
                    </div>
                </div>
                <div className="rpv-toolbar__item">
                    <MoreActionsPopover toolbarSlot={toolbarSlot} />
                </div>
            </div>
        </div>
    );
};
