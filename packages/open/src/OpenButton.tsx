/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderOpenProps } from './Open';
import OpenFileIcon from './OpenFileIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const OpenButton: React.FC<RenderOpenProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.open ? l10n.open.openFile : 'Open file';

    const inputRef = React.createRef<HTMLInputElement>();

    const openFileDialog = () => {
        const inputEle = inputRef.current;
        if (inputEle) {
            inputEle.click();
        }
    };

    return (
        <Tooltip
            ariaControlsSuffix="open"
            position={Position.BottomCenter}
            target={
                <div className="rpv-open__input-wrapper">
                    <input
                        ref={inputRef}
                        className="rpv-open__input"
                        multiple={false}
                        tabIndex={-1}
                        title=""
                        type="file"
                        onChange={onClick}
                    />
                    <MinimalButton ariaLabel={label as string} onClick={openFileDialog}>
                        <OpenFileIcon />
                    </MinimalButton>
                </div>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default OpenButton;
