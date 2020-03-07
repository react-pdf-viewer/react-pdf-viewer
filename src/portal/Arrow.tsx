/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

/* tslint:disable:prefer-object-spread */
import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import classNames from '../utils/classNames';
import './arrow.less';
import Position from './Position';

interface ArrowProps {
    customClassName?: string;
    position: Position;
}

const Arrow: React.FC<ArrowProps> = ({ customClassName, position }) => {
    const theme = React.useContext(ThemeContent);

    return (
        <div
            className={
                classNames({
                    [`${theme.prefixClass}-arrow`]: true,
                    [`${theme.prefixClass}-arrow-tl`]: position === Position.TopLeft,
                    [`${theme.prefixClass}-arrow-tc`]: position === Position.TopCenter,
                    [`${theme.prefixClass}-arrow-tr`]: position === Position.TopRight,
                    [`${theme.prefixClass}-arrow-rt`]: position === Position.RightTop,
                    [`${theme.prefixClass}-arrow-rc`]: position === Position.RightCenter,
                    [`${theme.prefixClass}-arrow-rb`]: position === Position.RightBottom,
                    [`${theme.prefixClass}-arrow-bl`]: position === Position.BottomLeft,
                    [`${theme.prefixClass}-arrow-bc`]: position === Position.BottomCenter,
                    [`${theme.prefixClass}-arrow-br`]: position === Position.BottomRight,
                    [`${theme.prefixClass}-arrow-lt`]: position === Position.LeftTop,
                    [`${theme.prefixClass}-arrow-lc`]: position === Position.LeftCenter,
                    [`${theme.prefixClass}-arrow-lb`]: position === Position.LeftBottom,
                    [`${customClassName}`]: customClassName !== '',
                })
            }
        />
    );
};

export default Arrow;
