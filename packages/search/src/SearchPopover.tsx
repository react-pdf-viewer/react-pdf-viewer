/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import {
    classNames,
    Button,
    LocalizationContext,
    MinimalButton,
    Position,
    Spinner,
    TextBox,
    TextDirection,
    ThemeContext,
    Tooltip,
} from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import { NextIcon } from './NextIcon';
import { PreviousIcon } from './PreviousIcon';
import { useSearch } from './useSearch';
import type { StoreProps } from './types/StoreProps';

const PORTAL_OFFSET = { left: 0, top: 8 };

export const SearchPopover: React.FC<{
    store: Store<StoreProps>;
    onToggle(): void;
}> = ({ store, onToggle }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const [isQuerying, setIsQuerying] = React.useState(false);
    const isRtl = direction === TextDirection.RightToLeft;

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
    } = useSearch(store);

    const onKeydownSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        // Press the Enter key
        if (e.key === 'Enter' && keyword) {
            setIsQuerying(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            search().then((_) => setIsQuerying(false));
        }
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

    const searchLabel = (l10n && l10n.search ? l10n.search.enterToSearch : 'Enter to search') as string;
    const previousMatchLabel = l10n && l10n.search ? l10n.search.previousMatch : 'Previous match';
    const nextMatchLabel = l10n && l10n.search ? l10n.search.nextMatch : 'Next match';

    return (
        <div className="rpv-search__popover">
            <div className="rpv-search__popover-input-counter">
                <TextBox
                    ariaLabel={searchLabel}
                    placeholder={searchLabel}
                    type="text"
                    value={keyword}
                    onChange={setKeyword}
                    onKeyDown={onKeydownSearch}
                />
                <div
                    className={classNames({
                        'rpv-search__popover-counter': true,
                        'rpv-search__popover-counter--ltr': !isRtl,
                        'rpv-search__popover-counter--rtl': isRtl,
                    })}
                >
                    {isQuerying && <Spinner size="1rem" />}
                    {!isQuerying && (
                        <span>
                            {currentMatch}/{numberOfMatches}
                        </span>
                    )}
                </div>
            </div>
            <label className="rpv-search__popover-label">
                <input
                    className="rpv-search__popover-label-checkbox"
                    checked={matchCase}
                    type="checkbox"
                    onChange={onChangeMatchCase}
                />{' '}
                {l10n && l10n.search ? l10n.search.matchCase : 'Match case'}
            </label>
            <label className="rpv-search__popover-label">
                <input
                    className="rpv-search__popover-label-checkbox"
                    checked={wholeWords}
                    type="checkbox"
                    onChange={onChangeWholeWords}
                />{' '}
                {l10n && l10n.search ? l10n.search.wholeWords : 'Whole words'}
            </label>
            <div className="rpv-search__popover-footer">
                <div className="rpv-search__popover-footer-item">
                    <Tooltip
                        ariaControlsSuffix="search-previous-match"
                        position={isRtl ? Position.BottomRight : Position.BottomCenter}
                        target={
                            <MinimalButton
                                ariaLabel={previousMatchLabel as string}
                                isDisabled={currentMatch <= 1}
                                onClick={jumpToPreviousMatch}
                            >
                                <PreviousIcon />
                            </MinimalButton>
                        }
                        content={() => previousMatchLabel}
                        offset={PORTAL_OFFSET}
                    />
                </div>
                <div className="rpv-search__popover-footer-item">
                    <Tooltip
                        ariaControlsSuffix="search-next-match"
                        position={Position.BottomCenter}
                        target={
                            <MinimalButton
                                ariaLabel={nextMatchLabel as string}
                                isDisabled={currentMatch > numberOfMatches - 1}
                                onClick={jumpToNextMatch}
                            >
                                <NextIcon />
                            </MinimalButton>
                        }
                        content={() => nextMatchLabel}
                        offset={PORTAL_OFFSET}
                    />
                </div>
                <div
                    className={classNames({
                        'rpv-search__popover-footer-button': true,
                        'rpv-search__popover-footer-button--ltr': !isRtl,
                        'rpv-search__popover-footer-button--rtl': isRtl,
                    })}
                >
                    <Button onClick={onClose}>{l10n && l10n.search ? l10n.search.close : 'Close'}</Button>
                </div>
            </div>
        </div>
    );
};
