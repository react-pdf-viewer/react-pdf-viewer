import React from 'react';
import { PluginFunctions, Store } from '@phuocng/rpv';

export interface RenderNextPageButtonProps {
    onClick: () => void,
}

export interface NextPageButtonProps {
    children?: ChildrenNextPageButton,
}

export type ChildrenNextPageButton = (props: RenderNextPageButtonProps) => React.ReactElement;

const NextPageButton: React.FC<{
    children?: ChildrenNextPageButton,
    store: Store<PluginFunctions>,
}> = ({ store, children }) => {
    const goToNextPage = () => {
        const editorState = store.get('getViewerState');
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage && editorState) {
            jumpToPage(editorState().pageIndex + 1);
        }
    };

    const defaultChildren = (props: RenderNextPageButtonProps) => (
        <button onClick={props.onClick}>Next</button>
    );
    const render = children || defaultChildren;

    return render({
        onClick: goToNextPage,
    });
};

export default NextPageButton;
