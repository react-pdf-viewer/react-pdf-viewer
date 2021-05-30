/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

const Spinner: React.FC = () => (
    <svg className='rpv-core__spinner' width="64px" height="64px" viewBox="0 0 32 32">
        <circle
            className='rpv-core__spinner-circle'
            cx="16"
            cy="16"
            r="12"
            strokeDasharray={Math.PI * 2 * 9}
        />
    </svg>
);

export default Spinner;
