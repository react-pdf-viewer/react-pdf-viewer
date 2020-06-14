/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import OpenFileIcon from '../icons/OpenFileIcon';
import LocalizationContext from '../localization/LocalizationContext';
import LocalizationMap from '../localization/LocalizationMap';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import ThemeContext from '../theme/ThemeContext';
import './openFileButton.less';

interface OpenFileButtonProps {
    onOpenFiles(files: FileList): void;
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const OpenFileButton: React.FC<OpenFileButtonProps> = ({ onOpenFiles }) => {
    const l10n = useContext(LocalizationContext);
    const theme = useContext(ThemeContext);

    const openFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (files) {
            onOpenFiles(files);
        }
    };

    const renderContent = (): LocalizationMap => l10n.toolbar.openFile;

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={(
                <div className={`${theme.prefixClass}-open-file`}>
                    <input
                        className={`${theme.prefixClass}-open-file-input`}
                        multiple={false}
                        type='file'
                        title=''
                        onChange={openFiles}
                    />
                    <OpenFileIcon />
                </div>
            )}
            content={renderContent}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default OpenFileButton;
