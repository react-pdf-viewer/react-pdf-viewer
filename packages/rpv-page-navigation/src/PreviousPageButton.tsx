import React from 'react';
import { PluginFunctions, Store } from '@phuocng/rpv';

export interface RenderPreviousPageButtonProps {
    onClick: () => void;
}

export interface PreviousPageButtonProps {
    children?: ChildrenPreviousPageButton;
}

export type ChildrenPreviousPageButton = (props: RenderPreviousPageButtonProps) => React.ReactElement;

const PreviousPageButton: React.FC<{
    children?: ChildrenPreviousPageButton,
    store: Store<PluginFunctions>,
}> = ({ store, children }) => {
    const goToPreviousPage = () => {
        const editorState = store.get('getViewerState');
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage && editorState) {
            jumpToPage(editorState().pageIndex - 1);
        }
    };

    const defaultChildren = (props: RenderPreviousPageButtonProps) => (
        <button onClick={props.onClick}>Previous</button>
    );
    const render = children || defaultChildren;

    return render({
        onClick: goToPreviousPage,
    });
};

export default PreviousPageButton;
