/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import './currentPageInput.less';
import StoreProps from './StoreProps';

const CurrentPageInput: React.FC<{
    store: Store<StoreProps>
}> = ({ store }) => {
    const [pageTextboxFocused, setPageTextboxFocused] = useState(false);
    const [editingPage, setEditingPage] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const handleNumberOfPages: StoreHandler<number> = (n: number) => {
        setNumberOfPages(n);
    };
    const handleCurrentPageChanged: StoreHandler<number> = (currentPage: number) => {
        setCurrentPage(currentPage);
    };

    useEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);
        store.subscribe('numberOfPages', handleNumberOfPages);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
            store.unsubscribe('numberOfPages', handleNumberOfPages);
        };
    }, []);

    const changePage = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    
    const jumpTo = (page: number) => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(page);
        }
    };

    const keydownPage = (e: React.KeyboardEvent): void => {
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
