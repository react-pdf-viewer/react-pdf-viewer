/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { StackContext } from './StackContext';

export const useClickOutsideStack = (
    closeOnClickOutside: boolean,
    onClickOutside: () => void,
): [React.RefCallback<HTMLElement>] => {
    const stackContext = React.useContext(StackContext);
    const [ele, setEle] = React.useState<HTMLElement>();

    const ref = React.useCallback((ele: HTMLElement) => {
        setEle(ele);
    }, []);

    const handleClickDocument = React.useCallback(
        (e: MouseEvent): void => {
            // Only process if we're on the topmost stack
            if (!ele || stackContext.currentIndex !== stackContext.numStacks) {
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
        [ele, stackContext.currentIndex, stackContext.numStacks],
    );

    React.useEffect(() => {
        if (!closeOnClickOutside || !ele) {
            return;
        }
        const eventOptions = {
            capture: true,
        };
        document.addEventListener('click', handleClickDocument, eventOptions);
        return (): void => {
            document.removeEventListener('click', handleClickDocument, eventOptions);
        };
    }, [ele, stackContext.currentIndex, stackContext.numStacks]);

    return [ref];
};
