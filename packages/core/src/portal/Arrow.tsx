/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Position } from '../structs/Position';
import styles from '../styles/arrow.module.css';
import { classNames } from '../utils/classNames';

export const Arrow: React.FC<{
    customClassName?: string;
    position: Position;
}> = ({ customClassName, position }) => (
    <div
        className={classNames({
            [styles.arrow]: true,
            [styles.arrowTopLeft]: position === Position.TopLeft,
            [styles.arrowTopCenter]: position === Position.TopCenter,
            [styles.arrowTopRight]: position === Position.TopRight,
            [styles.arrowRightTop]: position === Position.RightTop,
            [styles.arrowRightCenter]: position === Position.RightCenter,
            [styles.arrowRightBottom]: position === Position.RightBottom,
            [styles.arrowBottomLeft]: position === Position.BottomLeft,
            [styles.arrowBottomCenter]: position === Position.BottomCenter,
            [styles.arrowBottomRight]: position === Position.BottomRight,
            [styles.arrowLeftTop]: position === Position.LeftTop,
            [styles.arrowLeftCenter]: position === Position.LeftCenter,
            [styles.arrowLeftBottom]: position === Position.LeftBottom,
            [`${customClassName}`]: customClassName !== '',
        })}
    />
);
