/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';

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
    const [isFullScreen, setIsFullScreen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const closeOtherFullScreen = (): Promise<any> => {
        const ele = getFullScreenElement();
        return (ele && ele !== ref.current)
                ? exitFullScreen(ele)
                : Promise.resolve();
    };

    const openFullScreen = (): void => {
        closeOtherFullScreen().then(() => {
            if (ref.current) {
                requestFullScreen(ref.current);
            }
        });
    };

    const closeFullScreen = (): void => {
        const ele = getFullScreenElement();
        if (isFullScreen && ele && ele === ref.current) {
            exitFullScreen(document);
        }
    };

    const onFullScreenChange = (): void => {
        const ele = getFullScreenElement();
        setIsFullScreen(ele === ref.current);
    };

    useEffect(() => {
        addFullScreenChangeListener(onFullScreenChange);
        return (): void => {
            removeFullScreenChangeListener(onFullScreenChange);
        };
    }, [ref.current]);

    return {
        closeFullScreen,
        isFullScreen,
        openFullScreen,
    };
};

export default useFullScreen;
