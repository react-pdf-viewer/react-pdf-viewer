/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { FullScreenMode, Spinner, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';
import { type Zoom } from './types/Zoom';

export const FullScreenModeTracker: React.FC<{
    store: Store<StoreProps>;
    onEnterFullScreen: (zoom: Zoom) => void;
    onExitFullScreen: (zoom: Zoom) => void;
}> = ({ store, onEnterFullScreen, onExitFullScreen }) => {
    const [fullScreenMode, setFullScreenMode] = React.useState(store.get('fullScreenMode'));

    const handleFullScreenMode = React.useCallback((fullScreenMode: FullScreenMode) => {
        setFullScreenMode(fullScreenMode);
    }, []);

    const handleEnteredFullScreen = () => {
        onEnterFullScreen(store.get('zoom'));
    };

    const handleExitedFullScreen = () => {
        onExitFullScreen(store.get('zoom'));
    };

    React.useEffect(() => {
        switch (fullScreenMode) {
            case FullScreenMode.EnteredCompletely:
                handleEnteredFullScreen();
                break;
            case FullScreenMode.Exited:
                handleExitedFullScreen();
                break;
            default:
                break;
        }
    }, [fullScreenMode]);

    React.useEffect(() => {
        store.subscribe('fullScreenMode', handleFullScreenMode);

        return (): void => {
            store.unsubscribe('fullScreenMode', handleFullScreenMode);
        };
    }, []);

    return (
        (fullScreenMode === FullScreenMode.Entering || fullScreenMode === FullScreenMode.Entered) && (
            <div className="rpv-full-screen__overlay">
                <Spinner />
            </div>
        )
    );
};
