/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type Plugin } from '@react-pdf-viewer/core';
import * as React from 'react';
import { LocalePopover, LocalePopoverProps } from './LocalePopover';

export interface LocaleSwitcherPlugin extends Plugin {
    LocalePopover: (props: LocalePopoverProps) => React.ReactElement;
}

export const localeSwitcherPlugin = (): LocaleSwitcherPlugin => {
    const LocalePopoverDecorator = (props: LocalePopoverProps) => <LocalePopover {...props} />;

    return {
        LocalePopover: LocalePopoverDecorator,
    };
};
