/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import { Icon } from '@phuocng/rpv';

const ExitFullScreenIcon: React.FC = () => {
    return (
        <Icon size={16}>
            <path
                d={`M10.515,9.514h3c0.552,0,1,0.448,1,1v3c0,0.552-0.448,1-1,1h-3c-0.552,0-1-0.448-1-1v-3
                C9.515,9.962,9.963,9.514,10.515,9.514z
                M0.531,23.499l6.984-6.985
                M16.515,7.514L23.5,0.529
                M21.515,7.514h-5v-5
                M7.515,21.514v-5 h-5
                M0.523,0.521l6.992,6.993
                M16.515,16.514l6.985,6.985
                M16.515,21.514v-5h5
                M2.515,7.514h5v-5`}
            />
        </Icon>
    );
};

export default ExitFullScreenIcon;
