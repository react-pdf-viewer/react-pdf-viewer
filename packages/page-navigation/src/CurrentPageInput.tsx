/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, Store, TextBox } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import useCurrentPage from './useCurrentPage';
import useNumberOfPages from './useNumberOfPages';

const CurrentPageInput: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const l10n = React.useContext(LocalizationContext);
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
        switch (e.keyCode) {
            // Up key is pressed
            case 38:
                gotoPreviousPage();
                break;
            // Down key
            case 40:
                gotoNextPage();
                break;
            // Enter key
            case 13:
                jump();
                break;
            default:
                break;
        }
    };

    const label = l10n && l10n.pageNavigation ? l10n.pageNavigation.enterPageNumber : 'Enter a page number';

    return (
        <span className="rpv-page-navigation__current-page-input">
            <TextBox
                ariaLabel={label as string}
                type="text"
                value={editingPage}
                onChange={setEditingPage}
                onKeyDown={keydownPage}
            />
        </span>
    );
};

export default CurrentPageInput;
