/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Position } from '../structs/Position';
import { type Offset } from '../types/Offset';

export const calculatePosition = (
    content: HTMLElement,
    target: HTMLElement,
    position: Position,
    offset: Offset,
): Offset => {
    const targetRect = target.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const { height, width } = contentRect;

    let top = 0;
    let left = 0;

    switch (position) {
        case Position.TopLeft:
            top = targetRect.top - height;
            left = targetRect.left;
            break;
        case Position.TopCenter:
            top = targetRect.top - height;
            left = targetRect.left + targetRect.width / 2 - width / 2;
            break;
        case Position.TopRight:
            top = targetRect.top - height;
            left = targetRect.left + targetRect.width - width;
            break;

        case Position.RightTop:
            top = targetRect.top;
            left = targetRect.left + targetRect.width;
            break;
        case Position.RightCenter:
            top = targetRect.top + targetRect.height / 2 - height / 2;
            left = targetRect.left + targetRect.width;
            break;
        case Position.RightBottom:
            top = targetRect.top + targetRect.height - height;
            left = targetRect.left + targetRect.width;
            break;

        case Position.BottomLeft:
            top = targetRect.top + targetRect.height;
            left = targetRect.left;
            break;
        case Position.BottomCenter:
            top = targetRect.top + targetRect.height;
            left = targetRect.left + targetRect.width / 2 - width / 2;
            break;
        case Position.BottomRight:
            top = targetRect.top + targetRect.height;
            left = targetRect.left + targetRect.width - width;
            break;

        case Position.LeftTop:
            top = targetRect.top;
            left = targetRect.left - width;
            break;
        case Position.LeftCenter:
            top = targetRect.top + targetRect.height / 2 - height / 2;
            left = targetRect.left - width;
            break;
        case Position.LeftBottom:
            top = targetRect.top + targetRect.height - height;
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
