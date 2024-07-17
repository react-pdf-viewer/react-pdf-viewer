/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from './Icon';

export const ResizeIcon: React.FC = () => (
    <Icon>
        <circle cx={9} cy={12} r={1} />
        <circle cx={9} cy={5} r={1} />
        <circle cx={9} cy={19} r={1} />
        <circle cx={15} cy={12} r={1} />
        <circle cx={15} cy={5} r={1} />
        <circle cx={15} cy={19} r={1} />
    </Icon>
);
