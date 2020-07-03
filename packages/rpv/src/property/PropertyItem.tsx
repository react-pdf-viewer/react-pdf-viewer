/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import ThemeContext from '../theme/ThemeContext';
import './propertyItem.less';

interface PropertyItemProps {
    label: string;
    value: string;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ label, value }) => {
    const theme = useContext(ThemeContext);

    return (
        <dl className={`${theme.prefixClass}-property-item`}>
            <dt className={`${theme.prefixClass}-property-item-label`}>
                {label}:
            </dt>
            <dd className={`${theme.prefixClass}-property-item-value`}>
                {value || '-'}
            </dd>
        </dl>
    );
};

export default PropertyItem;
