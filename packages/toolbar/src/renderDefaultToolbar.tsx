/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { classNames, TextDirection, ThemeContext } from '@react-pdf-viewer/core';
import * as React from 'react';
import { MoreActionsPopover } from './MoreActionsPopover';
import { type ToolbarSlot } from './types/ToolbarSlot';
import { type TransformToolbarSlot } from './types/TransformToolbarSlot';

export const renderDefaultToolbar =
    (transformToolbarSlot: TransformToolbarSlot) =>
    // eslint-disable-next-line react/display-name
    (defaultToolbarSlot: ToolbarSlot): React.ReactElement => {
        const toolbarSlot = React.useMemo(() => transformToolbarSlot(defaultToolbarSlot), []);
        const { direction } = React.useContext(ThemeContext);
        const isRtl = direction === TextDirection.RightToLeft;
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
            <div
                data-testid="toolbar"
                className={classNames({
                    'rpv-toolbar': true,
                    'rpv-toolbar--rtl': isRtl,
                })}
                role="toolbar"
                aria-orientation="horizontal"
            >
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
                        <CurrentPageInput />
                        <span className="rpv-toolbar__label">
                            <NumberOfPages />
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
