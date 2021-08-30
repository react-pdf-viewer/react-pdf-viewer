import * as React from 'react';
import { render } from '@testing-library/react';
import { TextDirection, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { scrollModePlugin } from '../src';

const TestRtl: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const scrollModePluginInstance = scrollModePlugin();

    return (
        <div style={{ height: '720px', width: '720px' }}>
            <Viewer
                fileUrl={fileUrl}
                theme={{
                    direction: TextDirection.RightToLeft,
                }}
                plugins={[scrollModePluginInstance]}
            />
        </div>
    );
};

test('Support RTL', async () => {
    const { findByTestId, getByTestId } = render(<TestRtl fileUrl={global['__SAMPLE_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const pagesContainer = await findByTestId('core__inner-pages');
    expect(pagesContainer).toHaveClass('rpv-scroll-mode--rtl');
});
