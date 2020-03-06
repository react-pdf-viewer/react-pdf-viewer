/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

/* tslint:disable:prefer-object-spread */
import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import classNames from '../utils/classNames';
import './defaultLayout.less';
import Slot from './Slot';

const defaultLayout = (
    isSidebarOpened: boolean,
    container: Slot,
    main: Slot,
    toolbar: React.ReactElement,
    sidebar: Slot,
) => {
    const theme = React.useContext(ThemeContent);

    return (
        <div
            {...container.attrs}
            className={
                classNames({
                    [`${theme.prefixClass}-layout-container`]: true,
                    [`${theme.prefixClass}-layout-with-sidebar`]: isSidebarOpened,
                })
            }
            style={container.attrs.style}
        >
            {container.children}
            <div className={`${theme.prefixClass}-layout-toolbar`}>
                {toolbar}
            </div>
            <div className={`${theme.prefixClass}-layout-sidebar`}>
                {sidebar.children}
            </div>
            <div
                {...main.attrs}
                className={`${theme.prefixClass}-layout-main`}
                style={main.attrs.style}
            >
                {main.children}
            </div>
        </div>
    );
};

export default defaultLayout;
