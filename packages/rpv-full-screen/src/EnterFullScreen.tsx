/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { RefObject, useEffect, useRef } from 'react';
import { Store, StoreHandler } from '@phuocng/rpv';

import {
    addFullScreenChangeListener,
    exitFullScreen,
    getFullScreenElement,
    requestFullScreen,
} from './fullScreen';
import StoreProps from './StoreProps';

export interface RenderEnterFullScreenProps {
    onEnterFullScreen: () => void;
    onExitFullScreen: () => void;
}

export interface EnterFullScreenProps {
    children: RenderEnterFullScreen;
}

type RenderEnterFullScreen = (props: RenderEnterFullScreenProps) => React.ReactElement;

const EnterFullScreen: React.FC<{
    children: RenderEnterFullScreen,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const pagesRef = useRef<HTMLDivElement | null>(null);

    const closeOtherFullScreen = (): Promise<any> => {
        const pagesEle = pagesRef.current;
        if (!pagesEle) {
            return Promise.resolve();
        }

        const ele = getFullScreenElement();
        return (ele && ele !== pagesEle)
                ? exitFullScreen(ele)
                : Promise.resolve();
    };

    const enterFullScreen = () => {
        const pagesEle = pagesRef.current;
        if (!pagesEle) {
            return;
        }

        closeOtherFullScreen().then(() => {
            requestFullScreen(pagesEle);
        });
    };

    const closeFullScreen = (): void => {
        const pagesEle = pagesRef.current;
        if (!pagesEle) {
            return;
        }

        const ele = getFullScreenElement();
        if (ele && ele === pagesEle) {
            exitFullScreen(document);
        }
    };

    const onFullScreenChange = (): void => {
        const ele = getFullScreenElement();
        store.update('isFullScreen', ele === pagesRef.current);
    };

    const handlePagesRef: StoreHandler<() => RefObject<HTMLDivElement>> = (pagesRefFn: () => RefObject<HTMLDivElement>) => {
        pagesRef.current = pagesRefFn().current;
        addFullScreenChangeListener(onFullScreenChange);
    };

    useEffect(() => {
        store.subscribe('getPagesRef', handlePagesRef);
        return (): void => {
            store.unsubscribe('getPagesRef', handlePagesRef);
        };
    }, []);

    return children({
        onEnterFullScreen: enterFullScreen,
        onExitFullScreen: closeFullScreen,
    });
};

export default EnterFullScreen;
