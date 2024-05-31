/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';

export const usePrevious = <T>(value: T): T => {
    const ref = React.useRef<T>(value);

    React.useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};
