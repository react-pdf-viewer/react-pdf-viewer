/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Icon } from '@react-pdf-viewer/core';
import * as React from 'react';

export const TextSelectionIcon: React.FC = () => (
    <Icon size={16}>
        <path
            d={`M13.675,11.671l2.941-2.941c0.195-0.196,0.195-0.512-0.001-0.707C16.563,7.971,16.5,7.931,16.43,7.906
            L4.168,3.527C3.908,3.434,3.622,3.57,3.529,3.83c-0.039,0.109-0.039,0.228,0,0.336l4.379,12.262
            c0.093,0.26,0.379,0.396,0.639,0.303c0.07-0.025,0.133-0.065,0.185-0.117l2.943-2.943l6.146,6.146c0.195,0.195,0.512,0.195,0.707,0
            l1.293-1.293c0.195-0.195,0.195-0.512,0-0.707L13.675,11.671z`}
        />
    </Icon>
);
