/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import OpenFileIcon from '../icons/OpenFileIcon';
import LocalizationContext from '../localization/LocalizationContext';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import ThemeContent from '../theme/ThemeContext';
import './openFileButton.less';

interface OpenFileButtonProps {
    onOpenFiles(files: FileList): void;
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const OpenFileButton: React.FC<OpenFileButtonProps> = ({ onOpenFiles }) => {
    const l10n = React.useContext(LocalizationContext);
    const theme = React.useContext(ThemeContent);

    const openFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            onOpenFiles(files);
        }
    };

    const renderContent = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.openFile}</div>);

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={(
                <div
                    className="viewer-open-file"
                    style={{
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        position: 'relative',
                    }}
                >
                    <input
                        multiple={false}
                        style={{
                            bottom: '0',
                            height: '100%',
                            left: '0',
                            opacity: 0,
                            position: 'absolute',
                            right: '0',
                            top: '0',
                            width: '100%',
                        }}
                        type="file"
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
