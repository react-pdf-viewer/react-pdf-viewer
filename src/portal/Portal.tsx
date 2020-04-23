/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import useToggle, { Toggle } from '../hooks/useToggle';

type RenderContentType = (toggle: Toggle) => React.ReactNode;
type RenderTargetType = (toggle: Toggle, opened: boolean) => React.ReactNode;

interface PortalProps {
    content: RenderContentType;
    target: RenderTargetType;
}

const Portal: React.FC<PortalProps> = ({ content, target }) => {
    const { opened, toggle } = useToggle();
    return (
        <>
            {target(toggle, opened)}
            {opened && content(toggle)}
        </>
    );
};

export default Portal;
export type RenderContent = RenderContentType;
export type RenderTarget = RenderTargetType;
