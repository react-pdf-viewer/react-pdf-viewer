/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { type LocalizationMap } from '../types/LocalizationMap';
import enUs from './en_US.json';

export interface LocalizationContextProps {
    l10n: LocalizationMap;
    setL10n(l10n: LocalizationMap): void;
}

export const DefaultLocalization = enUs as unknown as LocalizationMap;

export const LocalizationContext = React.createContext<LocalizationContextProps>({
    l10n: DefaultLocalization,
    setL10n: () => {},
});
