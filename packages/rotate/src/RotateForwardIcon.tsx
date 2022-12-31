/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Icon } from '@react-pdf-viewer/core';
import * as React from 'react';

export const RotateForwardIcon: React.FC = () => (
    <Icon ignoreDirection={true} size={16}>
        <path
            d={`M20.566,10.537c-0.141-0.438-0.316-0.864-0.523-1.274
            M20.931,14.425C20.977,14.053,21,13.679,21,13.305 c0-0.291-0.014-0.579-0.041-0.863
            M19.611,18.111c0.341-0.539,0.624-1.114,0.843-1.713
            M16.837,20.9 c0.543-0.345,1.048-0.747,1.506-1.2
            M13.02,22.248c0.65-0.074,1.29-0.218,1.909-0.431
            M14,4.25h-2 c-4.987,0.015-9.017,4.069-9.003,9.055c0.013,4.581,3.456,8.426,8.008,8.945
            M10.5,1.75l3.5,2.5l-3.5,2.5`}
        />
    </Icon>
);
