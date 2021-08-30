import * as React from 'react';
import { render } from '@testing-library/react';
import { TextDirection, ThemeContext, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { attachmentPlugin } from '../src';

const TestRtl: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const attachmentPluginInstance = attachmentPlugin();
    const { Attachments } = attachmentPluginInstance;

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
                    <Attachments />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl={fileUrl} plugins={[attachmentPluginInstance]} />
                </div>
            </div>
        </ThemeContext.Provider>
    );
};

test('Support RTL', async () => {
    const { findByTestId, getByTestId } = render(<TestRtl fileUrl={global['__SAMPLE_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const emptyText = await findByTestId('attachment__empty');
    expect(emptyText).toHaveClass('rpv-attachment__empty--rtl');
});
