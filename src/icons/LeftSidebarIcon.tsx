/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Icon from './Icon';

const LeftSidebarIcon: React.FC<{}> = () => {
    return (
        <Icon size={16}>
            <path
                d={`M1.5,0.497h20c0.552,0,1,0.448,1,1v20c0,0.552-0.448,1-1,1h-20c-0.552,0-1-0.448-1-1v-20
                C0.5,0.945,0.948,0.497,1.5,0.497z
                M7.5,0.497v22`}
            />
        </Icon>
    );
};

export default LeftSidebarIcon;
