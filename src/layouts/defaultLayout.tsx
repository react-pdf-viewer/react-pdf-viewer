/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

/* tslint:disable:prefer-object-spread */
import React from 'react';

import './defaultLayout.less';
import Slot from './Slot';

const defaultLayout = (
    isSidebarOpened: boolean,
    container: Slot,
    main: Slot,
    toolbar: React.ReactElement,
    sidebar: Slot,
) => {
    return (
        <div
            {...container.attrs}
            className={`viewer-container ${isSidebarOpened ? 'viewer-with-sidebar' : ''}`}
            style={container.attrs.style}
        >
            {container.children}
            <div className='viewer-toolbar'>
                {toolbar}
            </div>
            <div className='viewer-sidebar'>
                {sidebar.children}
            </div>
            <div
                {...main.attrs}
                className='viewer-main'
                style={main.attrs.style}
            >
                {main.children}
            </div>
        </div>
    );
};

export default defaultLayout;
