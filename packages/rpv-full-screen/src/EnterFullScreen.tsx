/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Store } from '@phuocng/rpv';

import {
    exitFullScreen,
    getFullScreenElement,
    requestFullScreen,
} from './fullScreen';
import StoreProps from './StoreProps';

export interface RenderEnterFullScreenProps {
    onClick: () => void;
}

export interface EnterFullScreenProps {
    children: RenderEnterFullScreen;
}

type RenderEnterFullScreen = (props: RenderEnterFullScreenProps) => React.ReactElement;

const EnterFullScreen: React.FC<{
    children: RenderEnterFullScreen,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const closeOtherFullScreen = (): Promise<any> => {
        const pagesRef = store.get('getPagesRef');
        if (!pagesRef || !pagesRef().current) {
            return Promise.resolve();
        }

        const ele = getFullScreenElement();
        return (ele && ele !== pagesRef().current)
                ? exitFullScreen(ele)
                : Promise.resolve();
    };

    const enterFullScreen = () => {
        const pagesRef = store.get('getPagesRef');
        if (!pagesRef || !pagesRef().current) {
            return;
        }

        closeOtherFullScreen().then(() => {
            const ele = pagesRef().current as HTMLElement;
            requestFullScreen(ele);
        });
    };

    return children({
        onClick: enterFullScreen,
    });
};

export default EnterFullScreen;
