/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { Button, Store } from '@react-pdf-viewer/core';

import ExitFullScreenIcon from './ExitFullScreenIcon';
import { exitFullScreen, getFullScreenElement } from './fullScreen';
import StoreProps from './StoreProps';

const ExitFullScreenButton: React.FC<{
    store: Store<StoreProps>,
}> = ({ store }) => {
    const [isFullScreen, setFullScreen] = useState(false);

    const handleFullScreen = (fullScreen: boolean) => {
        setFullScreen(fullScreen);
    };

    const handleExitFullScreen = () => {
        setFullScreen(false);

        const pagesRef = store.get('getPagesRef');
        if (!pagesRef) {
            return;
        }

        const pagesEle = pagesRef().current;
        if (!pagesEle) {
            return;
        }

        const ele = getFullScreenElement();
        if (ele && ele === pagesEle) {
            exitFullScreen(document);
        }
    }

    useEffect(() => {
        store.subscribe('isFullScreen', handleFullScreen);
        return (): void => {
            store.unsubscribe('isFullScreen', handleFullScreen);
        };
    }, []);

    return (
        <>
        {
            isFullScreen &&
            <div className='rpv-full-screen-exit-button'>
                <div className='rpv-full-screen-exit-button-inner'>
                    <Button onClick={handleExitFullScreen}><ExitFullScreenIcon /></Button>
                </div>
            </div>
        }
        </>
    );
};

export default ExitFullScreenButton;
