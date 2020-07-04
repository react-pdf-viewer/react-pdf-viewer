import React from 'react';
import { Store } from '@phuocng/rpv';

import StoreProps from './StoreProps';

interface PreviousPageButtonProps {
    store: Store<StoreProps>;
}

const PreviousPageButton: React.FC<PreviousPageButtonProps> = ({ store }) => {
    const goToPreviousPage = () => {
        const editorState = store.get('getViewerState');
        const jumpToPage = store.get('jumpToPage');
        if (editorState && jumpToPage) {
            jumpToPage(editorState().pageIndex - 1);
        }
    };

    return (
        <button onClick={goToPreviousPage}>Previous</button>
    );
};

export default PreviousPageButton;
