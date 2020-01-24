/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Icon from './Icon';

const DownloadIcon: React.FC<{}> = () => {
    return (
        <Icon size={16}>
            <path
                d={`M17.5,11.5c3.314,0,6,2.686,6,6s-2.686,6-6,6s-6-2.686-6-6S14.186,11.5,17.5,11.5z
                M17.5,14.5v6
                M17.5,20.5
                l-2.25-2.25
                M17.5,20.5l2.25-2.25
                M10.5,23.5h-9c-0.552,0-1-0.448-1-1v-21c0-0.552,0.448-1,1-1h13.293
                c0.265,0,0.52,0.105,0.707,0.293L19.207,4.5C19.395,4.687,19.5,4.942,19.5,5.207V8.5`}
            />
        </Icon>
    );
};

export default DownloadIcon;
