/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Icon } from '@phuocng/rpv';

const PreviousIcon: React.FC = () => {
    return (
        <Icon size={16}>
            <path
                d={`M23.535,18.373L12.409,5.8c-0.183-0.207-0.499-0.226-0.706-0.043C11.688,5.77,11.674,5.785,11.66,5.8
                L0.535,18.373`}
            />
        </Icon>
    );
};

export default PreviousIcon;
