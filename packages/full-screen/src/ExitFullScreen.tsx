/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { ExitFullScreenButton } from './ExitFullScreenButton';
import { exitFullScreen, getFullScreenElement } from './fullScreen';
import type { StoreProps } from './types/StoreProps';

export interface RenderExitFullScreenProps {
    onClick(): void;
}

type RenderExitFullScreen = (props: RenderExitFullScreenProps) => React.ReactElement;

export interface ExitFullScreenProps {
    children?: RenderExitFullScreen;
}

export const ExitFullScreen: React.FC<{
    children?: RenderExitFullScreen;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const [isFullScreen, setFullScreen] = React.useState(false);

    const handleFullScreen = (fullScreen: boolean) => {
        console.log('Exit full screen 1');
        setFullScreen(fullScreen);
    };

    const handleExitFullScreen = () => {
        setFullScreen(false);

        const getPagesContainer = store.get('getPagesContainer');
        if (!getPagesContainer) {
            return;
        }

        const pagesEle = getPagesContainer();
        if (!pagesEle) {
            return;
        }

        const ele = getFullScreenElement();
        if (ele && ele === pagesEle) {
            exitFullScreen(document);
        }
    };

    React.useEffect(() => {
        store.subscribe('isFullScreen', handleFullScreen);
        return (): void => {
            store.unsubscribe('isFullScreen', handleFullScreen);
        };
    }, []);

    const defaultChildren = (props: RenderExitFullScreenProps) => <ExitFullScreenButton onClick={props.onClick} />;
    const render = children || defaultChildren;

    return (
        isFullScreen &&
        render({
            onClick: handleExitFullScreen,
        })
    );
};
