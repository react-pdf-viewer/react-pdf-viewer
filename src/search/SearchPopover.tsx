/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Button from '../components/Button';
import PrimaryButton from '../components/PrimaryButton';
import { Toggle } from '../hooks/useToggle';
import NextIcon from '../icons/NextIcon';
import PreviousIcon from '../icons/PreviousIcon';
import SearchIcon from '../icons/SearchIcon';
import LocalizationContext from '../localization/LocalizationContext';
import LocalizationMap from '../localization/LocalizationMap';
import Popover from '../portal/Popover';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import Match from './Match';
import './searchPopover.less';

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
const EMPTY_KEYWORD_REGEXP = new RegExp(' ');
const PORTAL_OFFSET = { left: 0, top: 8 };

interface SearchPopoverProps {
    doc: PdfJs.PdfDocument;
    onJumpToMatch(match: Match): void;
    onSearchFor(keyword: RegExp): void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({ doc, onJumpToMatch, onSearchFor }) => {
    const theme = React.useContext(ThemeContent);
    const { numPages } = doc;
    const indexArr = Array(numPages).fill(0).map((_, i) => i);
    const l10n = React.useContext(LocalizationContext);
    const [keyword, setKeyword] = React.useState('');
    const [found, setFound] = React.useState<Match[]>([]);
    const [currentMatch, setCurrentMatch] = React.useState(0);
    const [matchCase, setMatchCase] = React.useState(false);
    const [wholeWords, setWholeWords] = React.useState(false);
    const textContents = React.useRef<string[]>([]);

    const changeKeyword = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setKeyword(e.target.value);
    };

    const getTextContents = (): Promise<string[]> => {
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

    const buildKeywordRegex = (keywordParam: string, matchCaseParam: boolean, wholeWordsParam: boolean): RegExp => {
        const source = wholeWordsParam ? ` ${keywordParam} ` : keywordParam;
        const flags = matchCaseParam ? 'g' : 'gi';
        return new RegExp(source, flags);
    };

    const search = (keywordParam: string, matchCaseParam: boolean, wholeWordsParam: boolean): void => {
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

    const keydownSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        // Press the Enter key
        if (e.keyCode !== 13 || !keyword) {
            return;
        }
        search(keyword, matchCase, wholeWords);
    };

    const jumpToPreviousMatch = (): void => {
        const prev = currentMatch - 1;
        const updated = prev > 0 ? prev : found.length;
        setCurrentMatch(updated);
        onJumpToMatch(found[updated - 1]);
    };

    const jumpToNextMatch = (): void => {
        const next = currentMatch + 1;
        const updated = next <= found.length ? next : 1;
        setCurrentMatch(updated);
        onJumpToMatch(found[updated - 1]);
    };

    const changeMatchCase = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked = e.target.checked;
        setMatchCase(isChecked);
        if (keyword) {
            search(keyword, isChecked, wholeWords);
        }
    };

    const changeWholeWords = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked = e.target.checked;
        setWholeWords(isChecked);
        if (keyword) {
            search(keyword, matchCase, isChecked);
        }
    };

    const clearKeyword = (): void => {
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

    const renderSearch = (): LocalizationMap => l10n.toolbar.search;
    const renderTarget = (toggle: Toggle, opened: boolean): React.ReactElement => (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={toggle} isSelected={opened}><SearchIcon /></Button>}
            content={renderSearch}
            offset={PORTAL_OFFSET}
        />
    );
    const renderPreviousMatch = (): LocalizationMap => l10n.search.previousMatch;
    const renderNextMatch = (): LocalizationMap => l10n.search.nextMatch;

    const renderContent = (toggle: Toggle): React.ReactElement => {
        const close = (): void => {
            toggle();
            clearKeyword();
        };

        return (
            <div className={`${theme.prefixClass}-search-popover`}>
                <div className={`${theme.prefixClass}-search-popover-input-counter`}>
                    <input
                        className={`${theme.prefixClass}-search-popover-input`}
                        placeholder={`${l10n.search.enterToSearch}`}
                        type="text"
                        value={keyword}
                        onChange={changeKeyword}
                        onKeyDown={keydownSearch}
                    />
                    <div className={`${theme.prefixClass}-search-popover-counter`}>
                        {currentMatch}/{found.length}
                    </div>
                </div>
                <label className={`${theme.prefixClass}-search-popover-label`}>
                    <input
                        className={`${theme.prefixClass}-search-popover-label-checkbox`}
                        checked={matchCase}
                        type="checkbox"
                        onChange={changeMatchCase}
                    /> {l10n.search.matchCase}
                </label>
                <label className={`${theme.prefixClass}-search-popover-label`}>
                    <input
                        className={`${theme.prefixClass}-search-popover-label-checkbox`}
                        checked={wholeWords}
                        type="checkbox"
                        onChange={changeWholeWords}
                    /> {l10n.search.wholeWords}
                </label>
                <div className={`${theme.prefixClass}-search-popover-footer`}>
                    <div className={`${theme.prefixClass}-search-popover-footer-item`}>
                        <Tooltip
                            position={Position.BottomCenter}
                            target={<Button onClick={jumpToPreviousMatch}><PreviousIcon /></Button>}
                            content={renderPreviousMatch}
                            offset={PORTAL_OFFSET}
                        />
                    </div>
                    <div className={`${theme.prefixClass}-search-popover-footer-item`}>
                        <Tooltip
                            position={Position.BottomCenter}
                            target={<Button onClick={jumpToNextMatch}><NextIcon /></Button>}
                            content={renderNextMatch}
                            offset={PORTAL_OFFSET}
                        />
                    </div>
                    <div className={`${theme.prefixClass}-search-popover-footer-button`}>
                        <PrimaryButton onClick={close}>
                            {l10n.search.close}
                        </PrimaryButton>
                    </div>
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
