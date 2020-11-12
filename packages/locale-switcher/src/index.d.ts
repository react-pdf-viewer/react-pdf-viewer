/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationMap, Plugin } from '@react-pdf-viewer/core';

export interface LocaleSwitcherPlugin extends Plugin {
    LocalePopover: (props: LocalePopoverProps) => React.ReactElement;
}

export interface LocalePopoverProps {
    initialLocale?: string;
    locales: {
        [locale: string]: string;
    };
    localizations: {
        [locale: string]: LocalizationMap;
    };
    onUpdateLocalization: (localization: LocalizationMap) => void;
}

export function localeSwitcherPlugin(): LocaleSwitcherPlugin;

export class LocaleIcon extends React.Component {}
