import * as React from 'react';
import { Button, PrimaryButton, SpecialZoomLevel, TextBox, Viewer, Worker } from '@react-pdf-viewer/core';
import { Match, NextIcon, PreviousIcon, searchPlugin } from '@react-pdf-viewer/search';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

enum SearchStatus {
    NotSearchedYet,
    Searching,
    FoundResults,
}

const App = () => {
    const [keyword, setKeyword] = React.useState('');
    const [searchStatus, setSearchStatus] = React.useState(SearchStatus.NotSearchedYet);
    const [matches, setMatches] = React.useState<Match[]>([]);
    const [currentMatch, setCurrentMatch] = React.useState<Match | null>(null);
    const searchPluginInstance = searchPlugin({
        getMatchSample: (props) => props.pageText.substring(props.startIndex - 10, props.endIndex + 20),
    });
    const { highlight, jumpToMatch, jumpToPreviousMatch, jumpToNextMatch } = searchPluginInstance;

    const search = () => {
        setSearchStatus(SearchStatus.Searching);
        highlight(keyword).then(matches => {
            setSearchStatus(SearchStatus.FoundResults);
            setMatches(matches);
            setCurrentMatch(matches.length == 0 ? null : matches[0]);
        });
    };

    const handleClickPreviousButton = () => {
        const match = jumpToPreviousMatch();
        setCurrentMatch(match);
    };

    const handleClickNextButton = () => {
        const match = jumpToNextMatch();
        setCurrentMatch(match);
    };

    const handleJumpToMatch = (index: number) => {
        const match = jumpToMatch(index);
        setCurrentMatch(match);
    };

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.js">
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                }}
            >
                <div style={{ borderRight: '1px solid rgba(0, 0, 0, .2)', display: 'flex', flex: '0 0 15rem', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', padding: '.5rem' }}>
                        <div style={{ marginRight: '.5rem' }}>
                            <TextBox value={keyword} onChange={setKeyword} />
                        </div>
                        <PrimaryButton onClick={search}>Search</PrimaryButton>
                    </div>
                    {searchStatus == SearchStatus.FoundResults && (
                        <>
                            {matches.length === 0 && 'Not found'}
                            {matches.length > 0 && (
                                <>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ marginRight: '.5rem' }}>Found {matches.length} results</div>
                                        <div style={{ marginLeft: 'auto', marginRight: '.5rem' }}>
                                            <Button onClick={handleClickPreviousButton}><PreviousIcon /></Button>
                                        </div>
                                        <Button onClick={handleClickNextButton}><NextIcon /></Button>
                                    </div>
                                    <div style={{ flex: 1, overflow: 'auto' }}>
                                    {matches.map((match, index) =>
                                        <div key={index} style={{ backgroundColor: currentMatch === match ? 'rgba(0, 0, 0, .2)' : '', border: '1px solid rgba(0, 0, 0, .2)', padding: '.5rem', margin: '1rem 0' }}
                                            onClick={() => handleJumpToMatch(index)}
                                        >
                                            <div>{match.matchSample}</div>
                                            <div style={{ textAlign: 'right' }}>Page {match.pageIndex}</div>
                                        </div>
                                    )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer
                        fileUrl='pdf-open-parameters.pdf'               
                        plugins={[
                            searchPluginInstance,
                        ]}
                    />
                </div>
            </div>
        </Worker>
    );
};

export default App;
