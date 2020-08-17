/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';

interface PropertyItemProps {
    label: string;
    value: string;
}

const PropertyItem: FC<PropertyItemProps> = ({ label, value }) => {
    return (
        <dl className='rpv-property-item'>
            <dt className='rpv-property-item-label'>
                {label}:
            </dt>
            <dd className='rpv-property-item-value'>
                {value || '-'}
            </dd>
        </dl>
    );
};

export default PropertyItem;
