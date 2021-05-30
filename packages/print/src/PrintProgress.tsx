/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, PrimaryButton, ProgressBar } from '@react-pdf-viewer/core';

interface PrintProgressProps {
    numLoadedPages: number;
    numPages: number;
    onCancel(): void;
}

const PrintProgress: React.FC<PrintProgressProps> = ({ numLoadedPages, numPages, onCancel }) => {
    const l10n = React.useContext(LocalizationContext);
    const progress = Math.floor(numLoadedPages * 100 / numPages);

    return (
        <div className='rpv-print__progress'>
            <div className='rpv-print__progress-inner'>
                <div className='rpv-print__progress-message'>
                    {
                        l10n && l10n.print ? l10n.print.preparingDocument : 'Preparing document ...'
                    }
                </div>
                <div className='rpv-print__progress-bar'>
                    <ProgressBar progress={progress} />
                </div>
                <PrimaryButton onClick={onCancel}>
                    {
                        l10n && l10n.print ? l10n.print.cancel : 'Cancel'
                    }
                </PrimaryButton>
            </div>
        </div>
    );
};

export default PrintProgress;
