/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import { default as ILocalizationMap } from './LocalizationMap';

const LocalizationContext = React.createContext<ILocalizationMap>({});

export default LocalizationContext;
export type LocalizationMap = ILocalizationMap;
