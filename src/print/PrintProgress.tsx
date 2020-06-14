/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useContext } from 'react';

import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import LocalizationContext from '../localization/LocalizationContext';
import ThemeContext from '../theme/ThemeContext';
import './printProgress.less';

interface PrintProgressProps {
    numLoadedPages: number;
    numPages: number;
    onCancel(): void;
    onStartPrinting(): void;
}

const PrintProgress: React.FC<PrintProgressProps> = ({ numLoadedPages, numPages, onCancel, onStartPrinting }) => {
    const l10n = useContext(LocalizationContext);
    const theme = useContext(ThemeContext);
    const progress = Math.floor(numLoadedPages * 100 / numPages);
    useEffect(() => {
        if (numLoadedPages === numPages) {
            onStartPrinting();
        }
    }, [numLoadedPages]);

    return (
        <div className={`${theme.prefixClass}-print-progress`}>
            <div className={`${theme.prefixClass}-print-progress-inner`}>
                <div className={`${theme.prefixClass}-print-progress-message`}>{l10n.printProgress.preparingDocument}</div>
                <div className={`${theme.prefixClass}-print-progress-bar`}>
                    <ProgressBar progress={progress} />
                </div>
                <PrimaryButton onClick={onCancel}>
                    {l10n.printProgress.cancel}
                </PrimaryButton>
            </div>
        </div>
    );
};

export default PrintProgress;
