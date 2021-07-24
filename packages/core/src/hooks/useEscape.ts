/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

const useEscape = (handler: () => void): void => {
    const keyUpHandler = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            handler();
        }
    };

    React.useEffect(() => {
        document.addEventListener('keyup', keyUpHandler);
        return (): void => {
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, []);
};

export default useEscape;
