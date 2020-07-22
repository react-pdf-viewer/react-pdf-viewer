/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ChangeEvent, FC, KeyboardEvent, useState } from 'react';
import { Store } from '@phuocng/rpv';

import './currentPageInput.less';
import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

const CurrentPageInput: FC<{
    store: Store<StoreProps>
}> = ({ store }) => {
    const [pageTextboxFocused, setPageTextboxFocused] = useState(false);
    const [editingPage, setEditingPage] = useState(0);

    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const changePage = (e: ChangeEvent<HTMLInputElement>): void => {
        const newPage = parseInt(e.target.value, 10);
        if (newPage > 0 && newPage <= numberOfPages) {
            setEditingPage(newPage - 1);
        }
    };

    const focusPageTextbox = (): void => {
        setPageTextboxFocused(true);
        setEditingPage(currentPage);
    };

    const blurPageTextbox = (): void => {
        setPageTextboxFocused(false);
    };

    const gotoNextPage = (): void => {
        const nextPage = currentPage + 1;
        if (nextPage < numberOfPages) {
            setEditingPage(nextPage);
            jumpTo(nextPage);
        }
    };

    const gotoPreviousPage = (): void => {
        const previousPage = currentPage - 1;
        if (previousPage >= 0) {
            setEditingPage(previousPage);
            jumpTo(previousPage);
        }
    };
    
    const jumpTo = (page: number): void => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(page);
        }
    };

    const keydownPage = (e: KeyboardEvent): void => {
        switch (e.keyCode) {
            // Up key is pressed
            case 38: gotoPreviousPage(); break;
            // Down key
            case 40: gotoNextPage(); break;
            // Enter key
            case 13: jumpTo(editingPage); break;
            default: break;
        }
    };

    return (
        <input
            className='rpv-current-page-input'
            type='text'
            value={pageTextboxFocused ? (editingPage + 1) : (currentPage + 1)}
            onChange={changePage}
            onFocus={focusPageTextbox}
            onBlur={blurPageTextbox}
            onKeyDown={keydownPage}
        />
    );
};

export default CurrentPageInput;
