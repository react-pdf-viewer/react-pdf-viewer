import * as React from 'react';
import { render } from '@testing-library/react';
import { TextDirection, ThemeContext, Viewer } from '@react-pdf-viewer/core';

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
                    height: '100%',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                        overflow: 'auto',
                        width: '30%',
                    }}
                >
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

    const viewerEle = getByTestId('viewer');
    mockIsIntersecting(viewerEle, true);

    const defaultToolbar = await findByTestId('toolbar');
    expect(defaultToolbar).toHaveClass('rpv-toolbar--rtl');
});
