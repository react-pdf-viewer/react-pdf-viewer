/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const useClickOutside = (
    closeOnClickOutside: boolean,
    targetRef: React.RefObject<HTMLElement>,
    onClickOutside: () => void
): void => {
    const clickHandler = (e: MouseEvent): void => {
        const target = targetRef.current;
        if (target && !target.contains(e.target as Node)) {
            onClickOutside();
        }
    };

    React.useEffect(() => {
        if (!closeOnClickOutside) {
            return;
        }
        const eventOptions = {
            capture: true,
        };
        document.addEventListener('click', clickHandler, eventOptions);
        return (): void => {
            document.removeEventListener('click', clickHandler, eventOptions);
        };
    }, []);
};
