/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const usePrevious = <T>(value: T): T => {
    const ref = React.useRef<T>(value);

    React.useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};
