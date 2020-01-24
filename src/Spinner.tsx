/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import './spinner.css';

const Spinner: React.FC<{}> = () => {
    return (
        <svg className="viewer-spinner" width="64px" height="64px" viewBox="0 0 32 32">
            <circle
                cx="16"
                cy="16"
                fill="none"
                r="12"
                stroke="rgba(0, 0, 0, 0.4)"
                strokeDasharray={Math.PI * 2 * 9}
                strokeLinecap="round"
                strokeWidth="4"
            />
        </svg>
    );
};

export default Spinner;
