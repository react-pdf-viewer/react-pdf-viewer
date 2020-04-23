/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import Offset from '../portal/Offset';
import Position from '../portal/Position';

const calculatePosition = (content: HTMLElement, target: HTMLElement, position: Position, offset: Offset): Offset => {
    const targetRect = target.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const { height, width } = contentRect;

    let top = 0;
    let left = 0;

    switch (position) {
        case Position.TopLeft:
            top = -height;
            left = targetRect.left;
            break;
        case Position.TopCenter:
            top = -height;
            left = targetRect.left + targetRect.width / 2 - width / 2;
            break;
        case Position.TopRight:
            top = -height;
            left = targetRect.left + targetRect.width - width;
            break;

        case Position.RightTop:
            top = 0;
            left = targetRect.left + targetRect.width;
            break;
        case Position.RightCenter:
            top = targetRect.height / 2 - height / 2;
            left = targetRect.left + targetRect.width;
            break;
        case Position.RightBottom:
            top = targetRect.height - height;
            left = targetRect.left + targetRect.width;
            break;

        case Position.BottomLeft:
            top = targetRect.height;
            left = targetRect.left;
            break;
        case Position.BottomCenter:
            top = targetRect.height;
            left = targetRect.left + targetRect.width / 2 - width / 2;
            break;
        case Position.BottomRight:
            top = targetRect.height;
            left = targetRect.left + targetRect.width - width;
            break;

        case Position.LeftTop:
            top = 0;
            left = targetRect.left - width;
            break;
        case Position.LeftCenter:
            top = targetRect.height / 2 - height / 2;
            left = targetRect.left - width;
            break;
        case Position.LeftBottom:
            top = targetRect.height - height;
            left = targetRect.left - width;
            break;

        default:
            break;
    }

    return {
        left: left + (offset.left || 0),
        top: top + (offset.top || 0),
    };
};

export default calculatePosition;
