/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ThemeContext } from '@react-pdf-viewer/core';

import SwitchThemeButton from './SwitchThemeButton';

export interface RenderSwitchThemeProps {
    onClick: () => void;
}

type RenderSwitchTheme = (props: RenderSwitchThemeProps) => React.ReactElement;

export interface SwitchThemeProps {
    children?: RenderSwitchTheme;
}

const SwitchTheme: React.FC<{
    children?: RenderSwitchTheme;
}> = ({ children }) => {
    const theme = React.useContext(ThemeContext);
    const defaultChildern = (props: RenderSwitchThemeProps) => <SwitchThemeButton onClick={props.onClick} />;
    const render = children || defaultChildern;

    return render({
        onClick: () => theme.setCurrentTheme(theme.currentTheme === 'dark' ? 'light' : 'dark'),
    });
};

export default SwitchTheme;
