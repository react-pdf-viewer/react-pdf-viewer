/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import { ExitFullScreenIcon } from './ExitFullScreenIcon';
import { exitFullScreen, getFullScreenElement } from './fullScreen';
import type { StoreProps } from './types/StoreProps';

export const ExitFullScreenButton: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const [isFullScreen, setFullScreen] = React.useState(false);
    const l10n = React.useContext(LocalizationContext);

    const exitFullScreenLabel = l10n && l10n.fullScreen ? l10n.fullScreen.exitFullScreen : 'Exit full screen';

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
                        <MinimalButton ariaLabel={exitFullScreenLabel as string} onClick={handleExitFullScreen}>
                            <ExitFullScreenIcon />
                        </MinimalButton>
                    </div>
                </div>
            )}
        </>
    );
};
