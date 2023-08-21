/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const useDebounceCallback = <T extends unknown[]>(callback: (...args: T) => void, wait: number) => {
    const timeout = React.useRef<ReturnType<typeof setTimeout>>();

    const cleanup = () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    };

    React.useEffect(() => {
        return () => cleanup();
    }, []);

    return React.useCallback(
        (...args: T) => {
            cleanup();
            timeout.current = setTimeout(() => {
                callback(...args);
            }, wait);
        },
        [callback, wait],
    );
};
