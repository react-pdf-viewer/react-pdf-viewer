/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';

export const useClickOutside = (
    closeOnClickOutside: boolean,
    onClickOutside: () => void,
): [React.RefCallback<HTMLElement>] => {
    const [ele, setEle] = React.useState<HTMLElement>();

    const ref = React.useCallback((ele: HTMLElement) => {
        setEle(ele);
    }, []);

    const clickHandler = React.useCallback(
        (e: MouseEvent): void => {
            if (!ele) {
                return;
            }
            const clickedTarget = e.target;
            // Support Shadow DOM
            if (clickedTarget instanceof Element && clickedTarget.shadowRoot) {
                const paths = e.composedPath();
                if (paths.length > 0 && !ele.contains(paths[0] as Node)) {
                    onClickOutside();
                }
            } else if (!ele.contains(clickedTarget as Node)) {
                onClickOutside();
            }
        },
        [ele],
    );

    React.useEffect(() => {
        if (!closeOnClickOutside || !ele) {
            return;
        }
        const eventOptions = {
            capture: true,
        };
        document.addEventListener('click', clickHandler, eventOptions);
        return (): void => {
            document.removeEventListener('click', clickHandler, eventOptions);
        };
    }, [ele]);

    return [ref];
};
