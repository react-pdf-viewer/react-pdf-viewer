/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { classNames, TextDirection, ThemeContext } from '@react-pdf-viewer/core';
import * as React from 'react';
import { MoreActionsPopover } from './MoreActionsPopover';
import * as styles from './styles/defaultToolbar.module.css';
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
                    [styles.toolbar]: true,
                    [styles.toolbarRtl]: isRtl,
                })}
                role="toolbar"
                aria-orientation="horizontal"
            >
                <div className={styles.left}>
                    <div className={styles.item}>
                        <ShowSearchPopover />
                    </div>
                    <div className="rpv-core__display--hidden rpv-core__display--block-small">
                        <div className={styles.item}>
                            <GoToPreviousPage />
                        </div>
                    </div>
                    <div className={styles.item}>
                        <CurrentPageInput />
                        <span className={styles.label}>
                            <NumberOfPages />
                        </span>
                    </div>
                    <div className="rpv-core__display--hidden rpv-core__display--block-small">
                        <div className={styles.item}>
                            <GoToNextPage />
                        </div>
                    </div>
                </div>
                <div className={styles.center}>
                    <div className={styles.item}>
                        <ZoomOut />
                    </div>
                    <div className="rpv-core__display--hidden rpv-core__display--block-small">
                        <div className={styles.item}>
                            <Zoom />
                        </div>
                    </div>
                    <div className={styles.item}>
                        <ZoomIn />
                    </div>
                </div>
                <div className={styles.right}>
                    <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                        <div className={styles.item}>
                            <SwitchTheme />
                        </div>
                    </div>
                    <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                        <div className={styles.item}>
                            <EnterFullScreen />
                        </div>
                    </div>
                    <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                        <div className={styles.item}>
                            <Open />
                        </div>
                    </div>
                    <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                        <div className={styles.item}>
                            <Download />
                        </div>
                    </div>
                    <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                        <div className={styles.item}>
                            <Print />
                        </div>
                    </div>
                    <div className={styles.item}>
                        <MoreActionsPopover toolbarSlot={toolbarSlot} />
                    </div>
                </div>
            </div>
        );
    };
