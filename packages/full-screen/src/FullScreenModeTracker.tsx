/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { FullScreenMode, Spinner, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import styles from './styles/overlay.module.css';
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
        const zoom = store.get('zoom');
        if (zoom) {
            onEnterFullScreen(zoom);
        }
    };

    const handleExitedFullScreen = () => {
        const zoom = store.get('zoom');
        if (zoom) {
            onExitFullScreen(zoom);
        }
    };

    React.useEffect(() => {
        switch (fullScreenMode) {
            case FullScreenMode.Entered:
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
        fullScreenMode === FullScreenMode.Entering && (
            <div className={styles.overlay}>
                <Spinner />
            </div>
        )
    );
};
