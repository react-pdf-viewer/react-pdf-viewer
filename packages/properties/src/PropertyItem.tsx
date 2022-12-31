/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { classNames, TextDirection, ThemeContext } from '@react-pdf-viewer/core';
import * as React from 'react';

export const PropertyItem: React.FC<{
    label: string;
    value: string;
}> = ({ label, value }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    return (
        <dl
            className={classNames({
                'rpv-properties__item': true,
                'rpv-properties__item--rtl': isRtl,
            })}
        >
            <dt className="rpv-properties__item-label">{label}:</dt>
            <dd className="rpv-properties__item-value">{value || '-'}</dd>
        </dl>
    );
};
