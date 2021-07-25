/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const PropertyItem: React.FC<{
    label: string;
    value: string;
}> = ({ label, value }) => (
    <dl className="rpv-properties__item">
        <dt className="rpv-properties__item-label">{label}:</dt>
        <dd className="rpv-properties__item-value">{value || '-'}</dd>
    </dl>
);
