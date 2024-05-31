/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

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
