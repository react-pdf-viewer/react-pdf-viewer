import { TextDirection, ThemeContext, Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { toolbarPlugin } from '../src';

const TestRtl: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const [currentTheme, setCurrentTheme] = React.useState('light');

    const themeContext = {
        currentTheme,
        direction: TextDirection.RightToLeft,
        setCurrentTheme,
    };

    return (
        <ThemeContext.Provider value={themeContext}>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <div>
                    <Toolbar />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                </div>
            </div>
        </ThemeContext.Provider>
    );
};

test('Support RTL', async () => {
    const { findByTestId, getByTestId } = render(<TestRtl fileUrl={global['__SAMPLE_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

    const defaultToolbar = await findByTestId('toolbar');
    expect(defaultToolbar).toHaveClass('rpv-toolbar--rtl');
});
