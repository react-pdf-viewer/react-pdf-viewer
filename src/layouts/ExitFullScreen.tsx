/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Button from '../components/Button';
import ExitFullScreenIcon from '../icons/ExitFullScreenIcon';
import ThemeContent from '../theme/ThemeContext';
import './exitFullScreen.less';

interface ExitFullScreenProps {
    onClick(): void;
}

const ExitFullScreen: React.FC<ExitFullScreenProps> = ({ onClick }) => {
    const theme = React.useContext(ThemeContent);

    return (
        <div className={`${theme.prefixClass}-exit-fullscreen`}>
            <div className={`${theme.prefixClass}-exit-fullscreen-inner`}>
                <Button onClick={onClick}><ExitFullScreenIcon /></Button>
            </div>   
        </div>
    );
};

export default ExitFullScreen;
