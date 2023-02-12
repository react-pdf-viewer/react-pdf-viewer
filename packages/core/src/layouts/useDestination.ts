/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useStack } from '../hooks/useStack';
import type { Destination } from '../types/Destination';

export const useDestination = ({ getCurrentPage }: { getCurrentPage: () => number }) => {
    const previousDestinations = useStack<Destination>(20);

    const markVisitedDestination = React.useCallback((destination: Destination) => {
        previousDestinations.add(destination);
    }, []);

    const getPreviousDestination = (): Destination | null => {
        return previousDestinations.pop();
    };

    return {
        getPreviousDestination,
        markVisitedDestination,
    };
};
