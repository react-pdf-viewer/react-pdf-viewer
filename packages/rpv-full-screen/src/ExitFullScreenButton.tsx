/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useEffect, useState } from 'react';
import { Button, LocalizationContext, Position, Store, StoreHandler, Tooltip } from '@phuocng/rpv';

import ExitFullScreenIcon from './ExitFullScreenIcon';
import StoreProps from './StoreProps';
import './exitFullScreenButton.less';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const ExitFullScreenButton: React.FC<{
    store: Store<StoreProps>,
}> = ({ store }) => {
    const [isFullScreen, setFullScreen] = useState(false);
    const l10nContext = useContext(LocalizationContext);

    const label = (l10nContext && l10nContext.plugins)
            ? l10nContext.plugins.fullScreen.exitFullScreen
            : 'Exit full screen';

    const handleFullScreen = (fullScreen: boolean) => {
        setFullScreen(fullScreen);
    };

    const exitFullScreen = () => setFullScreen(false);

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
                    <Tooltip
                        position={Position.BottomCenter}
                        target={<Button onClick={exitFullScreen}><ExitFullScreenIcon /></Button>}
                        content={() => label}
                        offset={TOOLTIP_OFFSET}
                    />
                </div>
            </div>
        }
        </>
    );
};

export default ExitFullScreenButton;
