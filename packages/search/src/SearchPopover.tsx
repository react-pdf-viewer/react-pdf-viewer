/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Button, LocalizationContext, PdfJs, Position, PrimaryButton, Store, Tooltip } from '@react-pdf-viewer/core';

import NextIcon from './NextIcon';
import PreviousIcon from './PreviousIcon';
import StoreProps from './StoreProps';
import useSearch from './useSearch';

interface SearchPopoverProps {
    doc: PdfJs.PdfDocument;
    store: Store<StoreProps>;
    onToggle(): void;
}

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
const PORTAL_OFFSET = { left: 0, top: 8 };

const SearchPopover: React.FC<SearchPopoverProps> = ({ doc, store, onToggle }) => {
    const l10n = React.useContext(LocalizationContext);

    const {
        clearKeyword,
        changeMatchCase,
        changeWholeWords,
        currentMatch,
        jumpToNextMatch,
        jumpToPreviousMatch,
        keyword,
        matchCase,
        numberOfMatches,
        wholeWords,
        search,
        setKeyword,
    } = useSearch(doc, store);

    const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setKeyword(e.target.value);
    };

    const onKeydownSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        // Press the Enter key
        if (e.keyCode !== 13 || !keyword) {
            return;
        }
        search();
    };

    const onChangeMatchCase = (e: React.ChangeEvent<HTMLInputElement>): void => {
        changeMatchCase(e.target.checked);
    };

    const onChangeWholeWords = (e: React.ChangeEvent<HTMLInputElement>): void => {
        changeWholeWords(e.target.checked);
    };

    const onClose = (): void => {
        onToggle();
        clearKeyword();
    };

    return (
        <div className='rpv-search-popover'>
            <div className='rpv-search-popover-input-counter'>
                <input
                    className='rpv-search-popover-input'
                    placeholder={(l10n && l10n.search ? l10n.search.enterToSearch : 'Enter to search') as string}
                    type="text"
                    value={keyword}
                    onChange={onChangeKeyword}
                    onKeyDown={onKeydownSearch}
                />
                <div className='rpv-search-popover-counter'>
                    {currentMatch}/{numberOfMatches}
                </div>
            </div>
            <label className='rpv-search-popover-label'>
                <input
                    className='rpv-search-popover-label-checkbox'
                    checked={matchCase}
                    type="checkbox"
                    onChange={onChangeMatchCase}
                /> {l10n && l10n.search ? l10n.search.matchCase : 'Match case'}
            </label>
            <label className='rpv-search-popover-label'>
                <input
                    className='rpv-search-popover-label-checkbox'
                    checked={wholeWords}
                    type="checkbox"
                    onChange={onChangeWholeWords}
                /> {l10n && l10n.search ? l10n.search.wholeWords : 'Whole words'}
            </label>
            <div className='rpv-search-popover-footer'>
                <div className='rpv-search-popover-footer-item'>
                    <Tooltip
                        position={Position.BottomCenter}
                        target={<Button onClick={jumpToPreviousMatch}><PreviousIcon /></Button>}
                        content={() => (l10n && l10n.search ? l10n.search.previousMatch : 'Previous match')}
                        offset={PORTAL_OFFSET}
                    />
                </div>
                <div className='rpv-search-popover-footer-item'>
                    <Tooltip
                        position={Position.BottomCenter}
                        target={<Button onClick={jumpToNextMatch}><NextIcon /></Button>}
                        content={() => (l10n && l10n.search ? l10n.search.nextMatch : 'Next match')}
                        offset={PORTAL_OFFSET}
                    />
                </div>
                <div className='rpv-search-popover-footer-button'>
                    <PrimaryButton onClick={onClose}>
                        {l10n && l10n.search ? l10n.search.close : 'Close'}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default SearchPopover;
