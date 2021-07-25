/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import enUs from './en_US.json';
import { LocalizationContext } from './LocalizationContext';
import type { LocalizationMap } from '../types/LocalizationMap';

type SetLocalization = (l10n: LocalizationMap) => void;

export const LocalizationProvider: React.FC<{
    children: (setLocalization: SetLocalization) => React.ReactElement;
    localization?: LocalizationMap;
}> = ({ children, localization }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultL10n = enUs as any as LocalizationMap;

    const [l10nData, setL10nData] = React.useState(localization || defaultL10n);
    const setLocalization = (l10n: LocalizationMap) => setL10nData(l10n);

    return <LocalizationContext.Provider value={l10nData}>{children(setLocalization)}</LocalizationContext.Provider>;
};
