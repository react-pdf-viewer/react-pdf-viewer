/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement, useEffect, useRef } from 'react';
import { Store } from '@react-pdf-viewer/core';

import EnterFullScreenButton from './EnterFullScreenButton';
import { addFullScreenChangeListener, exitFullScreen, getFullScreenElement, requestFullScreen } from './fullScreen';
import StoreProps from './StoreProps';

export interface RenderEnterFullScreenProps {
    onClick(): void;
}

type RenderEnterFullScreen = (props: RenderEnterFullScreenProps) => ReactElement;

export interface EnterFullScreenProps {
    children?: RenderEnterFullScreen;
}

const EnterFullScreen: FC<{
    children?: RenderEnterFullScreen,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const pagesRef = useRef<HTMLElement | null>(store.get('getPagesContainer') ? store.get('getPagesContainer')() : null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const onFullScreenChange = (): void => {
        const ele = getFullScreenElement();
        store.update('isFullScreen', ele === pagesRef.current);
    };

    const handlePagesContainer = (getPagesContainer: () => HTMLElement) => {
        pagesRef.current = getPagesContainer();
        addFullScreenChangeListener(onFullScreenChange);
    };

    useEffect(() => {
        store.subscribe('getPagesContainer', handlePagesContainer);
        return (): void => {
            store.unsubscribe('getPagesContainer', handlePagesContainer);
        };
    }, []);

    const defaultChildren = (props: RenderEnterFullScreenProps) => <EnterFullScreenButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return render({
        onClick: enterFullScreen,
    });
};

export default EnterFullScreen;
