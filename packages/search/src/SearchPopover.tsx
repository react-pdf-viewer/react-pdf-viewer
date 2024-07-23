/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import {
    Button,
    LocalizationContext,
    MinimalButton,
    Position,
    Spinner,
    TextBox,
    TextDirection,
    ThemeContext,
    Tooltip,
    classNames,
    type LocalizationMap,
    type Store,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { NextIcon } from './NextIcon';
import { PreviousIcon } from './PreviousIcon';
import styles from './styles/searchPopover.module.css';
import { type StoreProps } from './types/StoreProps';
import { useSearch } from './useSearch';

export const SearchPopover: React.FC<{
    store: Store<StoreProps>;
    onToggle(): void;
}> = ({ store, onToggle }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const [isQuerying, setIsQuerying] = React.useState(false);
    const [searchDone, setSearchDone] = React.useState(false);
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

    const performSearch = (cb?: () => void) => {
        setIsQuerying(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        search().then((_) => {
            setIsQuerying(false);
            setSearchDone(true);
            cb && cb();
        });
    };

    const onKeydownSearch = (e: React.KeyboardEvent<Element>): void => {
        // Press the Enter key
        if (e.key === 'Enter' && keyword) {
            searchDone ? jumpToNextMatch() : performSearch();
        }
    };

    const onChangeMatchCase = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchDone(false);
        changeMatchCase(e.target.checked);
    };

    const onChangeWholeWords = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchDone(false);
        changeWholeWords(e.target.checked);
    };

    const onClose = (): void => {
        onToggle();
        clearKeyword();
    };

    const onChangeKeyword = (value: string) => {
        setSearchDone(false);
        setKeyword(value);
    };

    React.useEffect(() => {
        const initialKeyword = store.get('initialKeyword');
        if (initialKeyword && initialKeyword.length === 1 && keyword) {
            performSearch(() => {
                store.update('initialKeyword', []);
            });
        }
    }, []);

    const searchLabel =
        l10n && l10n.search ? ((l10n.search as LocalizationMap).enterToSearch as string) : 'Enter to search';
    const previousMatchLabel =
        l10n && l10n.search ? ((l10n.search as LocalizationMap).previousMatch as string) : 'Previous match';
    const nextMatchLabel = l10n && l10n.search ? ((l10n.search as LocalizationMap).nextMatch as string) : 'Next match';
    const closeButtonLabel = l10n && l10n.search ? ((l10n.search as LocalizationMap).close as string) : 'Close';

    return (
        <div className={styles.popover}>
            <div className={styles.inputCounter}>
                <TextBox
                    ariaLabel={searchLabel}
                    autoFocus={true}
                    placeholder={searchLabel}
                    type="text"
                    value={keyword}
                    onChange={onChangeKeyword}
                    onKeyDown={onKeydownSearch}
                />
                <div
                    className={classNames({
                        [styles.counter]: true,
                        [styles.counterLtr]: !isRtl,
                        [styles.counterRtl]: isRtl,
                    })}
                >
                    {isQuerying && <Spinner testId="search__popover-searching" size="1rem" />}
                    {!isQuerying && (
                        <span data-testid="search__popover-num-matches">
                            {currentMatch}/{numberOfMatches}
                        </span>
                    )}
                </div>
            </div>
            <label className={styles.label}>
                <input
                    className={styles.checkbox}
                    data-testid="search__popover-match-case"
                    checked={matchCase}
                    type="checkbox"
                    onChange={onChangeMatchCase}
                />{' '}
                {l10n && l10n.search ? ((l10n.search as LocalizationMap).matchCase as string) : 'Match case'}
            </label>
            <label className={styles.label}>
                <input
                    className={styles.checkbox}
                    checked={wholeWords}
                    data-testid="search__popover-whole-words"
                    type="checkbox"
                    onChange={onChangeWholeWords}
                />{' '}
                {l10n && l10n.search ? ((l10n.search as LocalizationMap).wholeWords as string) : 'Whole words'}
            </label>
            <div className={styles.footer}>
                <div className={styles.footerItem}>
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
                    />
                </div>
                <div className={styles.footerItem}>
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
                    />
                </div>
                <div
                    className={classNames({
                        [styles.footerButtonLtr]: !isRtl,
                        [styles.footerButtonRtl]: isRtl,
                    })}
                >
                    <Button onClick={onClose}>{closeButtonLabel}</Button>
                </div>
            </div>
        </div>
    );
};
