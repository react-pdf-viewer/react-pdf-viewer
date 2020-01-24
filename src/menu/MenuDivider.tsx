/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

const MenuDivider: React.FC<{}> = () => {
    return (
        <li
            style={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                margin: '4px 0',
            }}
        />
    );
};

export default MenuDivider;
