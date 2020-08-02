/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useState } from 'react';
import { Button, LocalizationContext, PdfJs, Position, PrimaryButton, Tooltip } from '@phuocng/rpv';

import Match from './Match';
import NextIcon from './NextIcon';
import PreviousIcon from './PreviousIcon';
import './searchPopover.less';

interface SearchPopoverProps {
    doc: PdfJs.PdfDocument;
    onToggle(): void;
}

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
const EMPTY_KEYWORD_REGEXP = new RegExp(' ');
const PORTAL_OFFSET = { left: 0, top: 8 };

const SearchPopover: React.FC<SearchPopoverProps> = ({ doc, onToggle }) => {
    const l10n = useContext(LocalizationContext);
    const [keyword, setKeyword] = useState('');
    const [found, setFound] = useState<Match[]>([]);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [matchCase, setMatchCase] = useState(false);
    const [wholeWords, setWholeWords] = useState(false);

    const changeKeyword = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setKeyword(e.target.value);
    };

    const keydownSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        // Press the Enter key
        if (e.keyCode !== 13 || !keyword) {
            return;
        }
        search(keyword, matchCase, wholeWords);
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
        // onSearchFor(EMPTY_KEYWORD_REGEXP);
        setKeyword('');
        setCurrentMatch(0);
        setFound([]);
        setMatchCase(false);
        setWholeWords(false);
    };

    const close = (): void => {
        onToggle();
        clearKeyword();
    };

    const search = (keywordParam: string, matchCaseParam: boolean, wholeWordsParam: boolean): void => {
    };

    const jumpToPreviousMatch = (): void => {
        const prev = currentMatch - 1;
        const updated = prev > 0 ? prev : found.length;
        setCurrentMatch(updated);
        // onJumpToMatch(found[updated - 1]);
    };

    const jumpToNextMatch = (): void => {
        const next = currentMatch + 1;
        const updated = next <= found.length ? next : 1;
        setCurrentMatch(updated);
        // onJumpToMatch(found[updated - 1]);
    };

    return (
        <div className='rpv-search-popover'>
            <div className='rpv-search-popover-input-counter'>
                <input
                    className='rpv-search-popover-input'
                    placeholder={(l10n && l10n.plugins && l10n.plugins.search ? l10n.plugins.search.enterToSearch : 'Enter to search') as string}
                    type="text"
                    value={keyword}
                    onChange={changeKeyword}
                    onKeyDown={keydownSearch}
                />
                <div className='rpv-search-popover-counter'>
                    {currentMatch}/{found.length}
                </div>
            </div>
            <label className='rpv-search-popover-label'>
                <input
                    className='rpv-search-popover-label-checkbox'
                    checked={matchCase}
                    type="checkbox"
                    onChange={changeMatchCase}
                /> {l10n && l10n.plugins && l10n.plugins.search ? l10n.plugins.search.matchCase : 'Match case'}
            </label>
            <label className='rpv-search-popover-label'>
                <input
                    className='rpv-search-popover-label-checkbox'
                    checked={wholeWords}
                    type="checkbox"
                    onChange={changeWholeWords}
                /> {l10n && l10n.plugins && l10n.plugins.search ? l10n.plugins.search.wholeWords : 'Whole words'}
            </label>
            <div className='rpv-search-popover-footer'>
                <div className='rpv-search-popover-footer-item'>
                    <Tooltip
                        position={Position.BottomCenter}
                        target={<Button onClick={jumpToPreviousMatch}><PreviousIcon /></Button>}
                        content={() => (l10n && l10n.plugins && l10n.plugins.search ? l10n.plugins.search.previousMatch : 'Previous match')}
                        offset={PORTAL_OFFSET}
                    />
                </div>
                <div className='rpv-search-popover-footer-item'>
                    <Tooltip
                        position={Position.BottomCenter}
                        target={<Button onClick={jumpToNextMatch}><NextIcon /></Button>}
                        content={() => (l10n && l10n.plugins && l10n.plugins.search ? l10n.plugins.search.nextMatch : 'Next match')}
                        offset={PORTAL_OFFSET}
                    />
                </div>
                <div className='rpv-search-popover-footer-button'>
                    <PrimaryButton onClick={close}>
                        {l10n && l10n.plugins && l10n.plugins.search ? l10n.plugins.search.close : 'Close'}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default SearchPopover;
