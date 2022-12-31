/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Icon } from '@react-pdf-viewer/core';
import * as React from 'react';

export const RotateBackwardIcon: React.FC = () => (
    <Icon ignoreDirection={true} size={16}>
        <path
            d={`M3.434,10.537c0.141-0.438,0.316-0.864,0.523-1.274
            M3.069,14.425C3.023,14.053,3,13.679,3,13.305 c0-0.291,0.014-0.579,0.041-0.863
            M4.389,18.111c-0.341-0.539-0.623-1.112-0.843-1.711
            M7.163,20.9 c-0.543-0.345-1.048-0.747-1.506-1.2
            M10.98,22.248c-0.65-0.074-1.29-0.218-1.909-0.431
            M10,4.25h2 c4.987,0.015,9.017,4.069,9.003,9.055c-0.013,4.581-3.456,8.426-8.008,8.945
            M13.5,1.75L10,4.25l3.5,2.5`}
        />
    </Icon>
);
