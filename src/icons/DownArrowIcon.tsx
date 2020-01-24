/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Icon from './Icon';

const DownArrowIcon: React.FC<{}> = () => {
    return (
        <Icon size={16}>
            <path
                d={`M2.32,2.966h19.452c0.552,0.001,1,0.449,0.999,1.001c0,0.182-0.05,0.36-0.144,0.516L12.9,20.552
                c-0.286,0.472-0.901,0.624-1.373,0.338c-0.138-0.084-0.254-0.2-0.338-0.338L1.465,4.483C1.179,4.01,1.331,3.396,1.804,3.11
                C1.96,3.016,2.138,2.966,2.32,2.966z`}
            />
        </Icon>
    );
};

export default DownArrowIcon;
