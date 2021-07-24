/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from '@react-pdf-viewer/core';

export const RightArrowIcon: React.FC = () => {
    return (
        <Icon size={16}>
            <path d="M9.248,17.572a.5.5,0,0,1-.748-.434V6.862a.5.5,0,0,1,.748-.434l8.992,5.138a.5.5,0,0,1,0,.868Z" />
        </Icon>
    );
};
