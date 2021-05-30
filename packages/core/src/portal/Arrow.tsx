/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import classNames from '../utils/classNames';
import Position from './Position';

interface ArrowProps {
    customClassName?: string;
    position: Position;
}

const Arrow: React.FC<ArrowProps> = ({ customClassName, position }) => (
    <div
        className={
            classNames({
                'rpv-core__arrow': true,
                'rpv-core__arrow--tl': position === Position.TopLeft,
                'rpv-core__arrow--tc': position === Position.TopCenter,
                'rpv-core__arrow--tr': position === Position.TopRight,
                'rpv-core__arrow--rt': position === Position.RightTop,
                'rpv-core__arrow--rc': position === Position.RightCenter,
                'rpv-core__arrow--rb': position === Position.RightBottom,
                'rpv-core__arrow--bl': position === Position.BottomLeft,
                'rpv-core__arrow--bc': position === Position.BottomCenter,
                'rpv-core__arrow--br': position === Position.BottomRight,
                'rpv-core__arrow--lt': position === Position.LeftTop,
                'rpv-core__arrow--lc': position === Position.LeftCenter,
                'rpv-core__arrow--lb': position === Position.LeftBottom,
                [`${customClassName}`]: customClassName !== '',
            })
        }
    />
);

export default Arrow;
