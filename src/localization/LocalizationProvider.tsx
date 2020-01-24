/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import en_US from './en_US.json';
import LocalizationContext from './LocalizationContext';
import LocalizationMap from './LocalizationMap';

interface LocalizationProviderProps {
    localization?: LocalizationMap;
}

const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children, localization }) => {
    const defaultL10n = (en_US as any) as LocalizationMap;
    const l10n = localization || defaultL10n;

    return (
        <LocalizationContext.Provider value={l10n}>
            {children}
        </LocalizationContext.Provider>
    );
};

export default LocalizationProvider;
