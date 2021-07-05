/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface MenuProps {
    children?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ children }) => <ul className="rpv-core__menu">{children}</ul>;

export default Menu;
