import {
    Icon,
    MinimalButton,
    PdfJsApiContext,
    Position,
    Tooltip,
    Viewer,
    type PdfJsApiProvider,
} from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { NextIcon, PreviousIcon, searchPlugin, type RenderSearchProps } from '../src';

const TestKeepCurrentHighlightAfterZoom: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const searchPluginInstance = searchPlugin();
    const zoomPluginInstance = zoomPlugin();
    const { Search } = searchPluginInstance;
    const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                className="rpv-core__viewer"
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#eeeeee',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        height: '2.5rem',
                        padding: '4px',
                    }}
                >
                    <Search>
                        {(renderSearchProps: RenderSearchProps) => {
                            const [readyToSearch, setReadyToSearch] = React.useState(false);
                            return (
                                <>
                                    <div
                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.3)',
                                            display: 'flex',
                                            padding: '0 2px',
                                        }}
                                    >
                                        <input
                                            data-testid="custom-search-input"
                                            style={{
                                                border: 'none',
                                                padding: '8px',
                                                width: '200px',
                                            }}
                                            placeholder="Enter to search"
                                            type="text"
                                            value={renderSearchProps.keyword}
                                            onChange={(e) => {
                                                setReadyToSearch(false);
                                                renderSearchProps.setKeyword(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && renderSearchProps.keyword) {
                                                    setReadyToSearch(true);
                                                    renderSearchProps.search();
                                                }
                                            }}
                                        />
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <button
                                                    style={{
                                                        background: '#fff',
                                                        border: 'none',
                                                        borderBottom: `2px solid ${
                                                            renderSearchProps.matchCase ? 'blue' : 'transparent'
                                                        }`,
                                                        height: '100%',
                                                        padding: '0 2px',
                                                    }}
                                                    onClick={() =>
                                                        renderSearchProps.changeMatchCase(!renderSearchProps.matchCase)
                                                    }
                                                >
                                                    <Icon>
                                                        <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                        <path d="M4.383 14.725L13.59 14.725" />
                                                        <path d="M0.5 21.725L3.52 21.725" />
                                                        <path d="M14.479 21.725L17.5 21.725" />
                                                        <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                        <path d="M16.92 16.725L20.794 16.725" />
                                                        <path d="M21.516 21.725L23.5 21.725" />
                                                    </Icon>
                                                </button>
                                            }
                                            content={() => 'Match case'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <button
                                                    style={{
                                                        background: '#fff',
                                                        border: 'none',
                                                        borderBottom: `2px solid ${
                                                            renderSearchProps.wholeWords ? 'blue' : 'transparent'
                                                        }`,
                                                        height: '100%',
                                                        padding: '0 2px',
                                                    }}
                                                    onClick={() =>
                                                        renderSearchProps.changeWholeWords(
                                                            !renderSearchProps.wholeWords,
                                                        )
                                                    }
                                                >
                                                    <Icon>
                                                        <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                        <path d="M3.5 9.498L3.5 14.498" />
                                                    </Icon>
                                                </button>
                                            }
                                            content={() => 'Match whole word'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                    </div>
                                    {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches === 0 && (
                                            <div style={{ padding: '0 8px' }}>Not found</div>
                                        )}
                                    {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches > 0 && (
                                            <div data-testid="num-matches" style={{ padding: '0 8px' }}>
                                                {renderSearchProps.currentMatch} of {renderSearchProps.numberOfMatches}
                                            </div>
                                        )}
                                    <div style={{ padding: '0 2px' }}>
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <MinimalButton onClick={renderSearchProps.jumpToPreviousMatch}>
                                                    <PreviousIcon />
                                                </MinimalButton>
                                            }
                                            content={() => 'Previous match'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                    </div>
                                    <div style={{ padding: '0 2px' }}>
                                        <Tooltip
                                            position={Position.BottomCenter}
                                            target={
                                                <MinimalButton
                                                    testId="next-match"
                                                    onClick={renderSearchProps.jumpToNextMatch}
                                                >
                                                    <NextIcon />
                                                </MinimalButton>
                                            }
                                            content={() => 'Next match'}
                                            offset={{ left: 0, top: 8 }}
                                        />
                                    </div>
                                </>
                            );
                        }}
                    </Search>
                    {/* Zoom buttons */}
                    <div style={{ marginLeft: 'auto' }}>
                        <Tooltip
                            position={Position.BottomCenter}
                            target={<ZoomOutButton />}
                            content={() => 'Zoom out'}
                            offset={{ left: 0, top: 8 }}
                        />
                    </div>
                    <div style={{ marginLeft: '0.25rem' }}>
                        <Tooltip
                            position={Position.BottomCenter}
                            target={<ZoomInButton />}
                            content={() => 'Zoom in'}
                            offset={{ left: 0, top: 8 }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance, zoomPluginInstance]} />
                </div>
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Keep the current highlight after zooming the document', async () => {
    const { findByTestId, getByTestId } = render(
        <TestKeepCurrentHighlightAfterZoom fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 758;
    viewerEle['__jsdomMockClientWidth'] = 798;

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

    const customSearchInput = await findByTestId('custom-search-input');
    fireEvent.change(customSearchInput, { target: { value: 'document' } });
    fireEvent.keyDown(customSearchInput, { key: 'Enter' });

    const numMatchesLabel = await findByTestId('num-matches');
    expect(numMatchesLabel.textContent).toEqual('1 of 22');

    // There are 3 results found on the second page
    let searchHighlights = await findByTestId('search__highlights-1');
    const highlights = searchHighlights.querySelectorAll('.rpv-search__highlight');
    expect(highlights.length).toEqual(3);

    let currentHighlight = searchHighlights.querySelector('.rpv-search__highlight--current');
    expect(currentHighlight?.getAttribute('data-index')).toEqual('0');

    // Click the zoom in button
    const zoomInButton = await findByTestId('zoom__in-button');
    fireEvent.click(zoomInButton);

    // The current highlight element should be there
    await findByTestId('core__text-layer-0');
    searchHighlights = await findByTestId('search__highlights-1');
    await findByTestId('core__text-layer-2');
    currentHighlight = searchHighlights.querySelector('.rpv-search__highlight--current');
    expect(currentHighlight?.getAttribute('data-index')).toEqual('0');

    // Jump to the next match
    const nextMatchButton = await findByTestId('next-match');
    fireEvent.click(nextMatchButton);
    fireEvent.click(nextMatchButton);

    currentHighlight = searchHighlights.querySelector('.rpv-search__highlight--current');
    expect(currentHighlight?.getAttribute('data-index')).toEqual('2');

    // Click the zoom out button
    const zoomOutButton = await findByTestId('zoom__out-button');
    fireEvent.click(zoomOutButton);

    // The current highlight element should be there
    await findByTestId('core__text-layer-0');
    searchHighlights = await findByTestId('search__highlights-1');
    await findByTestId('core__text-layer-2');
    currentHighlight = searchHighlights.querySelector('.rpv-search__highlight--current');
    expect(currentHighlight?.getAttribute('data-index')).toEqual('2');
});
