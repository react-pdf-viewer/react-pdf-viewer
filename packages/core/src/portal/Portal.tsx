/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useToggle } from '../hooks/useToggle';
import type { Toggle } from '../types/Toggle';

export type RenderContent = (toggle: Toggle) => React.ReactNode;
export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;

export const Portal: React.FC<{
    content: RenderContent;
    target: RenderTarget;
}> = ({ content, target }) => {
    const { opened, toggle } = useToggle();
    return (
        <>
            {target(toggle, opened)}
            {opened && content(toggle)}
        </>
    );
};
