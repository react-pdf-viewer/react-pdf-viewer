import { TextDirection, ThemeContext, Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { bookmarkPlugin } from '../src';

const TestRtl: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;

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
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                        overflow: 'auto',
                        width: '15rem',
                    }}
                >
                    <Bookmarks />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl={fileUrl} plugins={[bookmarkPluginInstance]} />
                </div>
            </div>
        </ThemeContext.Provider>
    );
};

test('Support RTL: There is no bookmark', async () => {
    const { findByTestId, getByTestId } = render(<TestRtl fileUrl={global['__SAMPLE_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

    const bookmarkContainer = await findByTestId('bookmark__empty');
    expect(bookmarkContainer).toHaveClass('rpv-bookmark__empty--rtl');
});

test('Support RTL: There are bookmarks', async () => {
    const { findByTestId, getByTestId } = render(<TestRtl fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    const bookmarkContainer = await findByTestId('bookmark__container');
    expect(bookmarkContainer).toHaveClass('rpv-bookmark__container--rtl');
});
