/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { MinimalButton, Store } from '@react-pdf-viewer/core';

import ExitFullScreenIcon from './ExitFullScreenIcon';
import { exitFullScreen, getFullScreenElement } from './fullScreen';
import StoreProps from './StoreProps';

const ExitFullScreenButton: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const [isFullScreen, setFullScreen] = React.useState(false);

    const handleFullScreen = (fullScreen: boolean) => {
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

    return (
        <>
            {isFullScreen && (
                <div className="rpv-full-screen__exit-button">
                    <div className="rpv-full-screen__exit-button-content">
                        <MinimalButton onClick={handleExitFullScreen}>
                            <ExitFullScreenIcon />
                        </MinimalButton>
                    </div>
                </div>
            )}
        </>
    );
};

export default ExitFullScreenButton;
