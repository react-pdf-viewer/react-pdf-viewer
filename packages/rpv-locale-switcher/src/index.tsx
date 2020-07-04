import React from 'react';
import { Plugin } from '@phuocng/rpv';

import LocaleIcon from './LocaleIcon';
import LocalePopover, { LocalePopoverProps } from './LocalePopover';

interface LocaleSwitcherPlugin extends Plugin {
    LocalePopover: (props: LocalePopoverProps) => React.ReactElement;
}

const localeSwitcherPlugin = (): LocaleSwitcherPlugin => {
    const LocalePopoverDecorator = (props: LocalePopoverProps) => (
        <LocalePopover {...props} />
    );

    return {
        LocalePopover: LocalePopoverDecorator,
    };
};

export default localeSwitcherPlugin;
export { LocaleIcon };
