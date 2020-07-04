import React from 'react';
import { Store } from '@phuocng/rpv';

import StoreProps from './StoreProps';

interface NextPageButtonProps {
    store: Store<StoreProps>;
}

const NextPageButton: React.FC<NextPageButtonProps> = ({ store }) => {
    const goToNextPage = () => {
        const editorState = store.get('getViewerState');
        const jumpToPage = store.get('jumpToPage');
        if (editorState && jumpToPage) {
            jumpToPage(editorState().pageIndex + 1);
        }
    };

    return (
        <button onClick={goToNextPage}>Next</button>
    );
};

export default NextPageButton;

