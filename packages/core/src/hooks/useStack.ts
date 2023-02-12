/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const useStack = <T>(maxLength: number) => {
    const stackRef = React.useRef<T[]>([]);

    const map = <V>(transformer: (item: T) => V): V[] => {
        return stackRef.current.map((item) => transformer(item));
    };

    // Remove the last item
    const pop = (): T | null => {
        const stack = stackRef.current;
        const size = stack.length;
        if (size === 0) {
            return null;
        }
        const lastItem = stack.pop();
        stackRef.current = stack;
        return lastItem;
    };

    // Add an item to the stack
    const push = (item: T): void => {
        const stack = stackRef.current;
        if (stack.length + 1 > maxLength) {
            stack.shift();
        }
        stack.push(item);
        stackRef.current = stack;
    };

    React.useEffect(() => {
        return () => {
            // Clear the stack
            stackRef.current = [];
        };
    }, []);

    return {
        push,
        map,
        pop,
    };
};
