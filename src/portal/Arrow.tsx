/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

/* tslint:disable:prefer-object-spread */
import React from 'react';

import Position from './Position';

interface ArrowProps {
    position: Position;
    styles: React.CSSProperties;
}

const Arrow: React.FC<ArrowProps> = ({ position, styles }) => {
    const updatedStyles = Object.assign({}, {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        height: '10px',
        position: 'absolute',
        width: '10px',
        zIndex: 0,
    }, styles);

    let posStyles = {};
    switch (position) {
        case Position.TopLeft:
            posStyles = {
                bottom: 0,
                left: 0,
                transform: 'translate(50%, 50%) rotate(45deg)',
            };
            break;
        case Position.TopCenter:
            posStyles = {
                bottom: 0,
                left: '50%',
                transform: 'translate(-50%, 50%) rotate(45deg)',
            };
            break;
        case Position.TopRight:
            posStyles = {
                bottom: 0,
                right: 0,
                transform: 'translate(-50%, 50%) rotate(45deg)',
            };
            break;

        case Position.RightTop:
            posStyles = {
                left: 0,
                top: 0,
                transform: 'translate(-50%, 50%) rotate(135deg)',
            };
            break;
        case Position.RightCenter:
            posStyles = {
                left: 0,
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(135deg)',
            };
            break;
        case Position.RightBottom:
            posStyles = {
                bottom: 0,
                left: 0,
                transform: 'translate(-50%, -50%) rotate(135deg)',
            };
            break;

        case Position.BottomLeft:
            posStyles = {
                left: 0,
                top: 0,
                transform: 'translate(50%, -50%) rotate(225deg)',
            };
            break;
        case Position.BottomCenter:
            posStyles = {
                left: '50%',
                top: 0,
                transform: 'translate(-50%, -50%) rotate(225deg)',
            };
            break;
        case Position.BottomRight:
            posStyles = {
                right: 0,
                top: 0,
                transform: 'translate(-50%, -50%) rotate(225deg)',
            };
            break;

        case Position.LeftTop:
            posStyles = {
                right: 0,
                top: 0,
                transform: 'translate(50%, 50%) rotate(315deg)',
            };
            break;
        case Position.LeftCenter:
            posStyles = {
                right: 0,
                top: '50%',
                transform: 'translate(50%, -50%) rotate(315deg)',
            };
            break;
        case Position.LeftBottom:
            posStyles = {
                bottom: 0,
                right: 0,
                transform: 'translate(50%, -50%) rotate(315deg)',
            };
            break;

        default:
            break;
    }

    return (
        <div
            style={Object.assign({}, posStyles, updatedStyles)}
        />
    );
};

export default Arrow;
