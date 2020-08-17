/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderOpenProps } from './Open';
import OpenFileIcon from './OpenFileIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const OpenButton: React.FC<RenderOpenProps> = ({ onClick }) => {
    const l10nContext = useContext(LocalizationContext);

    const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.open)
            ? l10nContext.plugins.open.openFile
            : 'Open file';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={(
                <div className='rpv-open-button'>
                    <input
                        className='rpv-open-button-input'
                        multiple={false}
                        type='file'
                        title=''
                        onChange={onClick}
                    />
                    <OpenFileIcon />
                </div>
            )}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default OpenButton;
