/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

/* tslint:disable:prefer-object-spread */
import React from 'react';

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
            style={Object.assign({}, {
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'grid',
                gridTemplateAreas: isSidebarOpened ? "'toolbar toolbar' 'sidebar main'" : "'toolbar' 'main'",
                gridTemplateColumns: isSidebarOpened ? '30% 1fr' : '1fr',
                gridTemplateRows: '40px calc(100% - 40px)',
                height: '100%',
                overflow: 'hidden',
                width: '100%',
            }, container.attrs.style)}
        >
            {container.children}
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#EEE',
                    borderBottom: '1px solid rgba(0, 0, 0, .1)',
                    display: 'flex',
                    gridArea: 'toolbar',
                    justifyContent: 'center',
                    padding: '4px',
                }}
            >
                {toolbar}
            </div>
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.2)',
                    display: isSidebarOpened ? 'flex' : 'none',
                    gridArea: 'sidebar',
                    justifyContent: 'center',
                }}
            >
                {sidebar.children}
            </div>
            <div
                {...main.attrs}
                style={Object.assign({}, {
                    gridArea: 'main',
                    overflow: 'scroll',
                }, main.attrs.style)}
            >
                {main.children}
            </div>
        </div>
    );
};

export default defaultLayout;
