/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface PropertyItemProps {
    label: string;
    value: string;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ label, value }) => {
    return (
        <dl className="rpv-properties__item">
            <dt className="rpv-properties__item-label">{label}:</dt>
            <dd className="rpv-properties__item-value">{value || '-'}</dd>
        </dl>
    );
};

export default PropertyItem;
