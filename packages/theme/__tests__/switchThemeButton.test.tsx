import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeContext, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps } from '@react-pdf-viewer/default-layout';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { themePlugin } from '../src';

const TestSwitchThemeButtonWithDefaultLayout: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <div style={{ display: 'flex' }}>
            <SwitchThemeButton />
        </div>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });
    const { toolbarPluginInstance } = defaultLayoutPluginInstance;
    const { themePluginInstance } = toolbarPluginInstance;
    const { SwitchThemeButton } = themePluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                height: '720px',
                width: '640px',
            }}
        >
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

const TestSwitchThemeButtonWithoutDefaultLayout: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const themePluginInstance = themePlugin();
    const { SwitchThemeButton } = themePluginInstance;

    const [currentTheme, setCurrentTheme] = React.useState('light');

    const themeContext = {
        currentTheme,
        setCurrentTheme,
    };

    return (
        <ThemeContext.Provider value={themeContext}>
            <div style={{ display: 'flex' }}>
                <SwitchThemeButton />
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '720px',
                    width: '640px',
                }}
            >
                <Viewer fileUrl={fileUrl} theme={currentTheme} plugins={[themePluginInstance]} />
            </div>
        </ThemeContext.Provider>
    );
};

test('SwitchThemeButton() component with the default layout', async () => {
    const { findByText, getByLabelText, getByTestId } = render(
        <TestSwitchThemeButtonWithDefaultLayout fileUrl={global['__HELLO_PDF__']} />
    );
    const viewerEle = getByTestId('viewer');

    mockIsIntersecting(viewerEle, true);

    let firstText = await findByText('Hello, world!');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');

    // Click the switch theme button
    const switchButton = await getByLabelText('Switch to the dark theme');
    fireEvent.click(switchButton);
    expect(viewerEle.classList.contains('rpv-core__viewer--dark')).toEqual(true);

    // Click again to switch back to the light theme
    const switchLightButton = await getByLabelText('Switch to the light theme');
    fireEvent.click(switchLightButton);
    expect(viewerEle.classList.contains('rpv-core__viewer--dark')).toEqual(false);
    expect(viewerEle.classList.contains('rpv-core__viewer--light')).toEqual(true);
});

test('SwitchThemeButton() component without the default layout', async () => {
    const { findByText, getByLabelText, getByTestId } = render(
        <TestSwitchThemeButtonWithoutDefaultLayout fileUrl={global['__HELLO_PDF__']} />
    );
    const viewerEle = getByTestId('viewer');

    mockIsIntersecting(viewerEle, true);

    let firstText = await findByText('Hello, world!');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');

    // Click the switch theme button
    const switchButton = await getByLabelText('Switch to the dark theme');
    fireEvent.click(switchButton);
    expect(viewerEle.classList.contains('rpv-core__viewer--dark')).toEqual(true);

    // Click again to switch back to the light theme
    const switchLightButton = await getByLabelText('Switch to the light theme');
    fireEvent.click(switchLightButton);
    expect(viewerEle.classList.contains('rpv-core__viewer--dark')).toEqual(false);
    expect(viewerEle.classList.contains('rpv-core__viewer--light')).toEqual(true);
});
