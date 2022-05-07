import { ThemeContext, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps } from '@react-pdf-viewer/default-layout';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
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
                height: '50rem',
                width: '50rem',
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
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} theme={currentTheme} plugins={[themePluginInstance]} />
            </div>
        </ThemeContext.Provider>
    );
};

test('SwitchThemeButton() component with the default layout', async () => {
    const { findByTestId, findByText, getByLabelText, getByTestId } = render(
        <TestSwitchThemeButtonWithDefaultLayout fileUrl={global['__HELLO_PDF__']} />
    );
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

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
    const { findByTestId, findByText, getByLabelText, getByTestId } = render(
        <TestSwitchThemeButtonWithoutDefaultLayout fileUrl={global['__HELLO_PDF__']} />
    );
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

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
