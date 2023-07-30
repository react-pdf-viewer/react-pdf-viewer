/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { LocalizationContext, TextBox, type LocalizationMap, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';
import { useCurrentPage } from './useCurrentPage';
import { useNumberOfPages } from './useNumberOfPages';

export const CurrentPageInput: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const [editingPage, setEditingPage] = React.useState('1');

    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    React.useEffect(() => setEditingPage(`${currentPage + 1}`), [currentPage]);

    const gotoNextPage = (): void => {
        const nextPage = currentPage + 1;
        if (nextPage < numberOfPages) {
            setEditingPage(`${nextPage + 1}`);
            jumpTo(nextPage);
        }
    };

    const gotoPreviousPage = (): void => {
        const previousPage = currentPage - 1;
        if (previousPage >= 0) {
            setEditingPage(`${previousPage + 1}`);
            jumpTo(previousPage);
        }
    };

    const jumpTo = (page: number): void => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(page);
        }
    };

    const jump = () => {
        const newPage = parseInt(editingPage, 10);
        editingPage === '' || newPage < 1 || newPage > numberOfPages
            ? setEditingPage(`${currentPage + 1}`)
            : jumpTo(newPage - 1);
    };

    const keydownPage = (e: React.KeyboardEvent): void => {
        switch (e.key) {
            // Up key is pressed
            case 'ArrowUp':
                gotoPreviousPage();
                break;
            // Down key
            case 'ArrowDown':
                gotoNextPage();
                break;
            // Enter key
            case 'Enter':
                jump();
                break;
            default:
                break;
        }
    };

    const label =
        l10n && l10n.pageNavigation
            ? ((l10n.pageNavigation as LocalizationMap).enterPageNumber as string)
            : 'Enter a page number';

    return (
        <span className="rpv-page-navigation__current-page-input">
            <TextBox
                ariaLabel={label}
                testId="page-navigation__current-page-input"
                type="text"
                value={editingPage}
                onChange={setEditingPage}
                onKeyDown={keydownPage}
            />
        </span>
    );
};
