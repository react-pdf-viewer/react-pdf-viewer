/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { Toggle } from '../hooks/useToggle';
import ModalBody from './ModalBody';
import ModalOverlay from './ModalOverlay';
import Portal, { RenderContent, RenderTarget } from './Portal';
import uniqueId from '../utils/uniqueId';

interface ModalProps {
    ariaControlsSuffix?: string;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    target: RenderTarget;
}

const Modal: React.FC<ModalProps> = ({ ariaControlsSuffix, closeOnClickOutside, closeOnEscape, content, target }) => {
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

    return <Portal target={renderTarget} content={renderContent} />;
};

export default Modal;
