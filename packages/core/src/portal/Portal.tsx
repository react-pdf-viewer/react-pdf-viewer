/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { type Toggle } from '../types/Toggle';

export type RenderContent = (toggle: Toggle) => React.ReactNode;
export type RenderTarget = (toggle: Toggle, opened: boolean, ariaControls: string) => React.ReactNode;

export const Portal: React.FC<{
    content: RenderContent;
    isOpened?: boolean;
    target?: RenderTarget;
    ariaControls?: string;
}> = ({ content, isOpened = false, target, ariaControls }) => {
    const { opened, toggle } = useToggle(isOpened);
    return (
        <>
            {target && target(toggle, opened, ariaControls)}
            {opened && content(toggle)}
        </>
    );
};
