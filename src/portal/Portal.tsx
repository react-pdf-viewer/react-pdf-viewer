/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import ReactDOM from 'react-dom';

import useToggle, { Toggle } from '../hooks/useToggle';

type RenderContent = (toggle: Toggle) => React.ReactNode;
type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;

interface PortalProps {
    content: RenderContent;
    target: RenderTarget;
}

const Portal: React.FC<PortalProps> = ({ content, target }) => {
    const { opened, toggle } = useToggle();
    return (
        <>
            {target(toggle, opened)}
            {opened && ReactDOM.createPortal(content(toggle), document.body)}
        </>
    );
};

export { RenderContent, RenderTarget };
export default Portal;
