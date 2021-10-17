import * as React from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src';

const TestOnSwitchTheme: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const [theme, setTheme] = React.useState('');
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div>
            <div data-testid="current-theme">{theme}</div>
            <div
                style={{
                    height: '720px',
                    width: '640px',
                }}
            >
                <Viewer fileUrl={fileUrl} onSwitchTheme={setTheme} plugins={[defaultLayoutPluginInstance]} />
            </div>
        </div>
    );
};

test('onSwitchTheme() callback', async () => {
    const { findByTestId, findByText, getByLabelText, getByTestId } = render(
        <TestOnSwitchTheme fileUrl={global['__SAMPLE_PDF__']} />
    );
    const viewerEle = getByTestId('core__viewer');

    mockIsIntersecting(viewerEle, true);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');

    // Click the switch theme button
    const switchButton = await getByLabelText('Switch to the dark theme');
    fireEvent.click(switchButton);

    await findByTestId('thumbnail__list');
    expect(viewerEle.classList.contains('rpv-core__viewer--dark')).toEqual(true);

    const currentThemeLabel = await findByTestId('current-theme');
    expect(currentThemeLabel.textContent).toEqual('dark');

    // Click again to switch back to the light theme
    const switchLightButton = await getByLabelText('Switch to the light theme');
    fireEvent.click(switchLightButton);

    await findByTestId('thumbnail__list');
    expect(viewerEle.classList.contains('rpv-core__viewer--light')).toEqual(true);
    expect(currentThemeLabel.textContent).toEqual('light');
});
