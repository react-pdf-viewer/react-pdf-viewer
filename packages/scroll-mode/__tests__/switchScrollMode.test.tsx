import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PrimaryButton, ScrollMode, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { scrollModePlugin } from '../src/index';

const TestSwitchScrollMode: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const scrollModePluginInstance = scrollModePlugin();
    const { switchScrollMode } = scrollModePluginInstance;

    return (
        <>
            <div
                style={{
                    marginBottom: '1rem',
                }}
            >
                <PrimaryButton onClick={() => switchScrollMode(ScrollMode.Horizontal)}>
                    Switch to horizontal mode
                </PrimaryButton>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} defaultScale={0.5} plugins={[scrollModePluginInstance]} />
            </div>
        </>
    );
};

test('call switchScrollMode() method', async () => {
    const { findByTestId, getByTestId } = render(<TestSwitchScrollMode fileUrl={global['__OPEN_PARAMS_PDF__']} />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    // Set the second page as visible
    const page = await findByTestId('core__page-layer-1');
    expect(parseInt(page.style.width, 10)).toEqual(297);
    expect(parseInt(page.style.height, 10)).toEqual(396);

    const switchModeButton = await screen.findByText('Switch to horizontal mode');
    fireEvent.click(switchModeButton);

    const pagesContainer = getByTestId('core__inner-pages');
    expect(pagesContainer).toHaveClass('rpv-core__inner-pages--horizontal');
});
