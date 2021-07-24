/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface SpinnerProps {
    size?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = '4rem' }) => (
    <div className="rpv-core__spinner" style={{ height: size, width: size }} />
);

export default Spinner;
