/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import type { Toggle } from '../types/Toggle';
import { uniqueId } from '../utils/uniqueId';
import { ModalBody } from './ModalBody';
import { Stack } from './Stack';

export type RenderContent = (toggle: Toggle) => React.ReactNode;
export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;

export const Modal: React.FC<{
    ariaControlsSuffix?: string;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    isOpened?: boolean;
    target?: RenderTarget;
}> = ({ ariaControlsSuffix, closeOnClickOutside, closeOnEscape, content, isOpened = false, target }) => {
    const controlsSuffix = ariaControlsSuffix || `${uniqueId()}`;
    const { opened, toggle } = useToggle(isOpened);

    const renderTarget = (toggle: Toggle, opened: boolean): React.ReactElement => {
        return target ? (
            <div
                aria-expanded={opened ? 'true' : 'false'}
                aria-haspopup="dialog"
                aria-controls={`rpv-core__modal-body-${controlsSuffix}`}
            >
                {target(toggle, opened)}
            </div>
        ) : (
            <></>
        );
    };

    const renderContent = (toggle: Toggle): React.ReactElement => (
        <ModalBody
            ariaControlsSuffix={controlsSuffix}
            closeOnClickOutside={closeOnClickOutside}
            closeOnEscape={closeOnEscape}
            onClose={toggle}
        >
            {({ onClose }) => content(onClose)}
        </ModalBody>
    );

    return (
        <>
            {renderTarget(toggle, opened)}
            {opened && <Stack>{renderContent(toggle)}</Stack>}
        </>
    );
};
