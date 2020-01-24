/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

const useKeyUp = (targetKeyCode: number, handler: () => void) => {
    const keyUpHandler = (e: KeyboardEvent) => (e.keyCode === targetKeyCode) && handler();

    React.useEffect(() => {
        document.addEventListener('keyup', keyUpHandler);
        return () => document.removeEventListener('keyup', keyUpHandler);
    }, []);
};

export default useKeyUp;
