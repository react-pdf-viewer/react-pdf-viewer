/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';

const DropArea: React.FC<{}> = () => {
    const l10n = React.useContext(LocalizationContext);
    return (
        <div
            style={{
                alignItems: 'center',
                backgroundColor: '#FFF',
                border: '2px dashed rgba(0, 0, 0, 0.3)',
                bottom: '0',
                display: 'flex',
                fontSize: '24px',
                height: '100%',
                justifyContent: 'center',
                left: '0',
                position: 'absolute',
                right: '0',
                top: '0',
                width: '100%',
                zIndex: 9999,
            }}
        >
            {l10n.main.dragDropFile}
        </div>
    );
};

export default DropArea;
