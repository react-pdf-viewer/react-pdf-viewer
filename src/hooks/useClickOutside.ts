/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect } from 'react';

const useClickOutside = (closeOnClickOutside: boolean, targetRef: React.RefObject<HTMLElement>, onClickOutside: () => void): void => {
    const clickHandler = (e: MouseEvent): void => {
        const target = targetRef.current;
        if (target && !target.contains(e.target as Node)) {
            onClickOutside();
        }
    };

    useEffect(() => {
        if (!closeOnClickOutside) {
            return;
        }

        document.addEventListener('click', clickHandler);
        return (): void => {
            document.removeEventListener('click', clickHandler);
        };
    }, []);
};

export default useClickOutside;
