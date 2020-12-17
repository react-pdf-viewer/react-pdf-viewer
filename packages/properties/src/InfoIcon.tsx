/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from '@react-pdf-viewer/core';

const InfoIcon: React.FC = () => {
    return (
        <Icon size={16}>
            <path
                d={`M12,1.001c6.075,0,11,4.925,11,11s-4.925,11-11,11s-11-4.925-11-11S5.925,1.001,12,1.001z
                M14.5,17.005H13
                c-0.552,0-1-0.448-1-1v-6.5c0-0.276-0.224-0.5-0.5-0.5H10
                M11.745,6.504L11.745,6.504
                M11.745,6.5c-0.138,0-0.25,0.112-0.25,0.25
                S11.607,7,11.745,7s0.25-0.112,0.25-0.25S11.883,6.5,11.745,6.5`}
            />
        </Icon>
    );
};

export default InfoIcon;
