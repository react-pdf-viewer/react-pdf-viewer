/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Toggle } from '../types/Toggle';
import { uniqueId } from '../utils/uniqueId';
import { ModalBody } from './ModalBody';
import { ModalOverlay } from './ModalOverlay';
import { Portal, RenderContent, RenderTarget } from './Portal';

export const Modal: React.FC<{
    ariaControlsSuffix?: string;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    isOpened?: boolean;
    target?: RenderTarget;
}> = ({ ariaControlsSuffix, closeOnClickOutside, closeOnEscape, content, isOpened = false, target }) => {
    const controlsSuffix = ariaControlsSuffix || `${uniqueId()}`;

    const renderTarget = (toggle: Toggle, opened: boolean): React.ReactElement => (
        <div
            aria-expanded={opened ? 'true' : 'false'}
            aria-haspopup="dialog"
            aria-controls={`rpv-core__modal-body-${controlsSuffix}`}
        >
            {target(toggle, opened)}
        </div>
    );

    const renderContent = (toggle: Toggle): React.ReactElement => (
        <ModalOverlay>
            <ModalBody
                ariaControlsSuffix={controlsSuffix}
                closeOnClickOutside={closeOnClickOutside}
                closeOnEscape={closeOnEscape}
                onToggle={toggle}
            >
                {content(toggle)}
            </ModalBody>
        </ModalOverlay>
    );

    return <Portal target={target ? renderTarget : null} content={renderContent} isOpened={isOpened} />;
};
