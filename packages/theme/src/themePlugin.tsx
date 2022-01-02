/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin } from '@react-pdf-viewer/core';

import { SwitchTheme, SwitchThemeProps } from './SwitchTheme';
import { SwitchThemeButton } from './SwitchThemeButton';
import { SwitchThemeMenuItem, SwitchThemeMenuItemProps } from './SwitchThemeMenuItem';

export interface ThemePlugin extends Plugin {
    SwitchTheme: (props: SwitchThemeProps) => React.ReactElement;
    SwitchThemeButton: () => React.ReactElement;
    SwitchThemeMenuItem: (props: SwitchThemeMenuItemProps) => React.ReactElement;
}

export const themePlugin = (): ThemePlugin => {
    const SwitchThemeDecorator = (props: SwitchThemeProps) => <SwitchTheme {...props} />;

    const SwitchThemeButtonDecorator = () => (
        <SwitchThemeDecorator>{(props) => <SwitchThemeButton {...props} />}</SwitchThemeDecorator>
    );

    const SwitchThemeMenuItemDecorator = (props: SwitchThemeMenuItemProps) => (
        <SwitchThemeDecorator>
            {(p) => (
                <SwitchThemeMenuItem
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </SwitchThemeDecorator>
    );

    return {
        SwitchTheme: SwitchThemeDecorator,
        SwitchThemeButton: SwitchThemeButtonDecorator,
        SwitchThemeMenuItem: SwitchThemeMenuItemDecorator,
    };
};
