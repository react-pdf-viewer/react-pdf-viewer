/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface PropertyItemProps {
    label: string;
    value: string;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ label, value }) => {
    return (
        <dl style={{ margin: '8px 0' }}>
            <dt
                style={{
                    display: 'inline-block',
                    paddingRight: '8px',
                    width: '30%',
                }}
            >
                {label}:
            </dt>
            <dd style={{ display: 'inline-block' }}>{value || '-'}</dd>
        </dl>
    );
};

export default PropertyItem;
