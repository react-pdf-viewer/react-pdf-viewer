/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@react-pdf-viewer/core';

import LocalePopover, { LocalePopoverProps } from './LocalePopover';

interface LocaleSwitcherPlugin extends Plugin {
    LocalePopover: (props: LocalePopoverProps) => React.ReactElement;
}

const localeSwitcherPlugin = (): LocaleSwitcherPlugin => {
    const LocalePopoverDecorator = (props: LocalePopoverProps) => <LocalePopover {...props} />;

    return {
        LocalePopover: LocalePopoverDecorator,
    };
};

export default localeSwitcherPlugin;
