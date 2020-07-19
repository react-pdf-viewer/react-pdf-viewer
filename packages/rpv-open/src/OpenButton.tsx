/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { LocalizationContext, Position, Store, Tooltip } from '@phuocng/rpv';

import './openFileButton.less';
import OpenFileIcon from './OpenFileIcon';
import StoreProps from './StoreProps';

interface RenderOpenButtonProps {
    onClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OpenButtonProps {
    children?: RenderOpenButton;
}

export type RenderOpenButton = (props: RenderOpenButtonProps) => React.ReactElement;

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const OpenButton: React.FC<{
    children?: RenderOpenButton,
    store: Store<StoreProps>,
}> = ({ store, children }) => {
    const l10nContext = useContext(LocalizationContext);

    const handleOpenFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (!files || !files.length) {
            return;
        }
        const openFile = store.get('openFile');
        if (openFile) {
            openFile(files[0]);
        }
    };

    const defaultChildren = (props: RenderOpenButtonProps) => {
        const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.open)
            ? l10nContext.plugins.open.openFile
            : 'Open file';

        return (
            <Tooltip
                position={Position.BottomCenter}
                target={(
                    <div className='rpv-open-file'>
                        <input
                            className='rpv-open-file-input'
                            multiple={false}
                            type='file'
                            title=''
                            onChange={handleOpenFiles}
                        />
                        <OpenFileIcon />
                    </div>
                )}
                content={() => label}
                offset={TOOLTIP_OFFSET}
            />
        );
    };
    const render = children || defaultChildren;

    return render({
        onClick: handleOpenFiles,
    });
};

export default OpenButton;
