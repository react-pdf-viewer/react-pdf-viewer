/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import {
    addFullScreenChangeListener,
    exitFullScreen,
    getFullScreenElement,
    removeFullScreenChangeListener,
    requestFullScreen,
} from '../utils/fullScreen';

interface FullScreenHook {
    isFullScreen: boolean;
    closeFullScreen(): void;
    openFullScreen(): void;
}

const useFullScreen = (ref: React.RefObject<HTMLDivElement>): FullScreenHook => {
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    React.useEffect(() => {
        addFullScreenChangeListener(onFullScreenChange);
        return () => {
            removeFullScreenChangeListener(onFullScreenChange);
        };
    }, [ref.current]);

    const closeOtherFullScreen = () => {
        const ele = getFullScreenElement();
        return (ele && ele !== ref.current)
                ? exitFullScreen(ele)
                : Promise.resolve();
    };

    const openFullScreen = () => {
        closeOtherFullScreen().then((_: any) => {
            if (ref.current) {
                requestFullScreen(ref.current);
            }
        });
    };

    const closeFullScreen = () => {
        const ele = getFullScreenElement();
        if (isFullScreen && ele && ele === ref.current) {
            exitFullScreen(document);
        }
    };

    const onFullScreenChange = () => {
        const ele = getFullScreenElement();
        setIsFullScreen(ele === ref.current);
    };

    return {
        closeFullScreen,
        isFullScreen,
        openFullScreen,
    };
};

export default useFullScreen;
