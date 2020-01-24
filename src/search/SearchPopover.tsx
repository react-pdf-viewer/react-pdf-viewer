/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Button from '../Button';
import { Toggle } from '../hooks/useToggle';
import NextIcon from '../icons/NextIcon';
import PreviousIcon from '../icons/PreviousIcon';
import SearchIcon from '../icons/SearchIcon';
import LocalizationContext from '../localization/LocalizationContext';
import PdfJs from '../PdfJs';
import Popover from '../portal/Popover';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import Match from './Match';

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
const EMPTY_KEYWORD_REGEXP = new RegExp(' ');
const PORTAL_OFFSET = { left: 0, top: 8 };

interface SearchPopoverProps {
    doc: PdfJs.PdfDocument;
    onJumpToMatch(match: Match): void;
    onSearchFor(keyword: RegExp): void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({ doc, onJumpToMatch, onSearchFor }) => {
    const { numPages } = doc;
    const indexArr = Array(numPages).fill(0).map((_, i) => i);
    const l10n = React.useContext(LocalizationContext);
    const [keyword, setKeyword] = React.useState('');
    const [found, setFound] = React.useState<Match[]>([]);
    const [currentMatch, setCurrentMatch] = React.useState(0);
    const [matchCase, setMatchCase] = React.useState(false);
    const [wholeWords, setWholeWords] = React.useState(false);
    const textContents = React.useRef<string[]>([]);

    const changeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const getTextContents = () => {
        const promises = indexArr.map((pageIndex) => {
            return doc.getPage(pageIndex + 1).then((page) => {
                return page.getTextContent();
            }).then((content) => {
                const pageContent = content.items.map((item) => item.str || '').join('');
                return Promise.resolve({
                    pageContent,
                    pageIndex,
                });
            });
        });
        return Promise.all(promises).then((data) => {
            data.sort((a, b) => a.pageIndex - b.pageIndex);
            return Promise.resolve(data.map((item) => item.pageContent));
        });
    };

    const buildKeywordRegex = (keywordParam: string, matchCaseParam: boolean, wholeWordsParam: boolean) => {
        const source = wholeWordsParam ? ` ${keywordParam} ` : keywordParam;
        const flags = matchCaseParam ? 'g' : 'gi';
        return new RegExp(source, flags);
    };

    const search = (keywordParam: string, matchCaseParam: boolean, wholeWordsParam: boolean) => {
        const regexp = buildKeywordRegex(keywordParam, matchCaseParam, wholeWordsParam);
        onSearchFor(regexp);

        setCurrentMatch(0);
        setFound([]);

        const promise = (textContents.current.length === 0)
            ? getTextContents().then((response) => {
                textContents.current = response;
                return Promise.resolve(response);
            })
            : Promise.resolve(textContents.current);

        promise.then((response) => {
            const arr: Match[] = [];
            response.forEach((item, pageIndex) => {
                const numMatches = (item.match(regexp) || []).length;
                for (let matchIndex = 0; matchIndex < numMatches; matchIndex++) {
                    arr.push({
                        matchIndex,
                        pageIndex,
                    });
                }
            });
            setFound(arr);
            if (arr.length > 0) {
                setCurrentMatch(1);
                onJumpToMatch(arr[0]);
            }
        });
    };

    const keydownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Press the Enter key
        if (e.keyCode !== 13 || !keyword) {
            return;
        }
        search(keyword, matchCase, wholeWords);
    };

    const jumpToPreviousMatch = () => {
        const prev = currentMatch - 1;
        const updated = prev > 0 ? prev : found.length;
        setCurrentMatch(updated);
        onJumpToMatch(found[updated - 1]);
    };

    const jumpToNextMatch = () => {
        const next = currentMatch + 1;
        const updated = next <= found.length ? next : 1;
        setCurrentMatch(updated);
        onJumpToMatch(found[updated - 1]);
    };

    const changeMatchCase = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setMatchCase(isChecked);
        if (keyword) {
            search(keyword, isChecked, wholeWords);
        }
    };

    const changeWholeWords = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setWholeWords(isChecked);
        if (keyword) {
            search(keyword, matchCase, isChecked);
        }
    };

    const clearKeyword = () => {
        if (!keyword) {
            // Do nothing
        }
        onSearchFor(EMPTY_KEYWORD_REGEXP);
        setKeyword('');
        setCurrentMatch(0);
        setFound([]);
        setMatchCase(false);
        setWholeWords(false);
    };

    const renderSearch = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.search}</div>);
    const renderTarget = (toggle: Toggle, opened: boolean) => (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={toggle} isSelected={opened}><SearchIcon /></Button>}
            content={renderSearch}
            offset={PORTAL_OFFSET}
        />
    );
    const renderPreviousMatch = () => (<div style={{ padding: '8px' }}>{l10n.search.previousMatch}</div>);
    const renderNextMatch = () => (<div style={{ padding: '8px' }}>{l10n.search.nextMatch}</div>);

    const renderContent = (toggle: Toggle) => {
        const close = () => {
            toggle();
            clearKeyword();
        };

        return (
            <div style={{ padding: '8px' }}>
                <div
                    style={{
                        alignItems: 'center',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        margin: '0 4px 8px 4px',
                        position: 'relative',
                        width: '180px',
                    }}
                >
                    <input
                        placeholder={`${l10n.search.enterToSearch}`}
                        style={{
                            border: 'none',
                            padding: '4px',
                            width: '100%',
                        }}
                        type="text"
                        value={keyword}
                        onChange={changeKeyword}
                        onKeyDown={keydownSearch}
                    />
                    <div
                        style={{
                            alignItems: 'center',
                            bottom: '0',
                            display: 'flex',
                            paddingRight: '4px',
                            position: 'absolute',
                            right: '0',
                            top: '0',
                        }}
                    >
                        {currentMatch}/{found.length}
                    </div>
                </div>
                <label
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        marginBottom: '8px',
                    }}
                >
                    <input
                        checked={matchCase}
                        style={{ marginRight: '4px' }}
                        type="checkbox"
                        onChange={changeMatchCase}
                    /> {l10n.search.matchCase}
                </label>
                <label
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        marginBottom: '8px',
                    }}
                >
                    <input
                        checked={wholeWords}
                        style={{ marginRight: '4px' }}
                        type="checkbox"
                        onChange={changeWholeWords}
                    /> {l10n.search.wholeWords}
                </label>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <div style={{ padding: '0 4px' }}>
                        <Tooltip
                            position={Position.BottomCenter}
                            target={<Button onClick={jumpToPreviousMatch}><PreviousIcon /></Button>}
                            content={renderPreviousMatch}
                            offset={PORTAL_OFFSET}
                        />
                    </div>
                    <div style={{ padding: '0 4px' }}>
                        <Tooltip
                            position={Position.BottomCenter}
                            target={<Button onClick={jumpToNextMatch}><NextIcon /></Button>}
                            content={renderNextMatch}
                            offset={PORTAL_OFFSET}
                        />
                    </div>
                    <button
                        style={{
                            backgroundColor: '#357EDD',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#FFF',
                            cursor: 'pointer',
                            marginLeft: 'auto',
                            padding: '8px',
                        }}
                        onClick={close}
                    >
                        {l10n.search.close}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Popover
            position={Position.BottomLeft}
            target={renderTarget}
            content={renderContent}
            offset={PORTAL_OFFSET}
            closeOnClickOutside={false}
            closeOnEscape={true}
        />
    );
};

export default SearchPopover;
