import { MinimalButton, Spinner, TextBox, Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import type { Match, RenderSearchProps } from '../src';
import { NextIcon, PreviousIcon, searchPlugin } from '../src';

enum SearchStatus {
    NotSearchedYet,
    Searching,
    FoundResults,
}

const SearchSidebarInner: React.FC<{
    renderSearchProps: RenderSearchProps;
}> = ({ renderSearchProps }) => {
    const [searchStatus, setSearchStatus] = React.useState(SearchStatus.NotSearchedYet);
    const [matches, setMatches] = React.useState<Match[]>([]);

    const {
        currentMatch,
        isDocumentLoaded,
        keyword,
        setKeyword,
        jumpToMatch,
        jumpToNextMatch,
        jumpToPreviousMatch,
        search,
    } = renderSearchProps;

    const renderMatchSample = (match: Match) => {
        //  match.startIndex    match.endIndex
        //      |                       |
        //      ▼                       ▼
        //  ....[_____props.keyword_____]....

        const wordsBefore = match.pageText.substr(match.startIndex - 20, 20);
        let words = wordsBefore.split(' ');
        words.shift();
        const begin = words.length === 0 ? wordsBefore : words.join(' ');

        const wordsAfter = match.pageText.substr(match.endIndex, 60);
        words = wordsAfter.split(' ');
        words.pop();
        const end = words.length === 0 ? wordsAfter : words.join(' ');

        return (
            <div>
                {begin}
                <span style={{ backgroundColor: 'rgb(255, 255, 0)' }}>
                    {match.pageText.substring(match.startIndex, match.endIndex)}
                </span>
                {end}
            </div>
        );
    };

    const performSearch = () => {
        setSearchStatus(SearchStatus.Searching);
        search().then((matches) => {
            setSearchStatus(SearchStatus.FoundResults);
            setMatches(matches);
        });
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && keyword) {
            performSearch();
        }
    };

    React.useEffect(() => {
        if (isDocumentLoaded && keyword) {
            performSearch();
        }
    }, [isDocumentLoaded]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                width: '100%',
            }}
        >
            <div style={{ padding: '.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <TextBox
                        placeholder="Enter to search"
                        value={keyword}
                        onChange={setKeyword}
                        onKeyDown={handleSearchKeyDown}
                    />
                    {searchStatus === SearchStatus.Searching && (
                        <div
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                bottom: 0,
                                position: 'absolute',
                                right: '.5rem',
                                top: 0,
                            }}
                        >
                            <Spinner size="1.5rem" />
                        </div>
                    )}
                </div>
            </div>
            {searchStatus === SearchStatus.FoundResults && (
                <>
                    {matches.length === 0 && 'Not found'}
                    {matches.length > 0 && (
                        <>
                            <div
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    padding: '.5rem',
                                }}
                            >
                                <div
                                    data-testid="num-matches"
                                    style={{
                                        color: 'rgba(0, 0, 0, .5)',
                                        fontSize: '.8rem',
                                        marginRight: '.5rem',
                                    }}
                                >
                                    Found {matches.length} results
                                </div>
                                <div style={{ marginLeft: 'auto', marginRight: '.5rem' }}>
                                    <MinimalButton ariaLabel="Previous match" onClick={jumpToPreviousMatch}>
                                        <PreviousIcon />
                                    </MinimalButton>
                                </div>
                                <MinimalButton ariaLabel="Next match" onClick={jumpToNextMatch}>
                                    <NextIcon />
                                </MinimalButton>
                            </div>
                            <div
                                style={{
                                    borderTop: '1px solid rgba(0, 0, 0, .2)',
                                    flex: 1,
                                    overflow: 'auto',
                                    padding: '.5rem 1rem',
                                }}
                            >
                                {matches.map((match, index) => (
                                    <div key={index} style={{ margin: '1rem 0' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '.5rem',
                                            }}
                                        >
                                            <div>#{index + 1}</div>
                                            <div
                                                style={{
                                                    color: 'rgba(0, 0, 0, .5)',
                                                    fontSize: '.8rem',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                Page {match.pageIndex + 1}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                backgroundColor: currentMatch === index + 1 ? 'rgba(0, 0, 0, .1)' : '',
                                                border: '1px solid rgba(0, 0, 0, .2)',
                                                borderRadius: '.25rem',
                                                cursor: 'pointer',
                                                overflowWrap: 'break-word',
                                                padding: '.5rem',
                                            }}
                                            onClick={() => jumpToMatch(index + 1)}
                                        >
                                            {renderMatchSample(match)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

const TestSearchInitialKeywordSidebar: React.FC<{
    fileUrl: Uint8Array;
    keyword: string;
}> = ({ fileUrl, keyword }) => {
    const searchPluginInstance = searchPlugin({
        keyword: {
            keyword,
            matchCase: true,
        },
    });
    const { Search } = searchPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                height: '50rem',
                width: '64rem',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, .2)',
                    flex: '0 0 15rem',
                    width: '15rem',
                }}
            >
                <Search>
                    {(renderSearchProps: RenderSearchProps) => (
                        <SearchSidebarInner renderSearchProps={renderSearchProps} />
                    )}
                </Search>
            </div>

            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
            </div>
        </div>
    );
};

test('Perform search for the initial keyword in a sidebar', async () => {
    const { findByPlaceholderText, findByTestId, getByTestId } = render(
        <TestSearchInitialKeywordSidebar fileUrl={global['__OPEN_PARAMS_PDF__']} keyword="PDF" />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 782;

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

    // Check if the keyword is populated properly
    let searchInput = await findByPlaceholderText('Enter to search');
    let currentKeyword = (searchInput as HTMLInputElement).value;
    expect(currentKeyword).toEqual('PDF');

    // Check the number of matches
    let numOfMatchesLabel = await findByTestId('num-matches');
    let numOfMatches = numOfMatchesLabel.textContent;
    expect(numOfMatches).toEqual('Found 28 results');
});
