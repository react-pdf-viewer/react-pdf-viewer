import { Viewer } from '@react-pdf-viewer/core';
import { render } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { bookmarkPlugin } from '../src';

const TestBookmarks: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;

    return (
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
                <Bookmarks />
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[bookmarkPluginInstance]} />
            </div>
        </div>
    );
};

test('Test Bookmarks component', async () => {
    const { findByText, getByTestId } = render(<TestBookmarks fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const bookmarkTitle = await findByText('Parameters for Opening PDF Files');
    expect(bookmarkTitle).toHaveClass('rpv-bookmark__title');
});
