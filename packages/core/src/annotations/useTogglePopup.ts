/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useToggle } from '../hooks/useToggle';
import { ToggleStatus } from '../structs/ToggleStatus';

enum TogglePopupBy {
    Click = 'Click',
    Hover = 'Hover',
}

export const useTogglePopup = (): {
    opened: boolean;
    closeOnHover: () => void;
    openOnHover: () => void;
    toggleOnClick: () => void;
} => {
    const { opened, toggle } = useToggle(false);
    const [togglePopupBy, setTooglePopupBy] = React.useState(TogglePopupBy.Hover);

    const toggleOnClick = (): void => {
        switch (togglePopupBy) {
            case TogglePopupBy.Click:
                opened && setTooglePopupBy(TogglePopupBy.Hover);
                toggle(ToggleStatus.Toggle);
                break;
            case TogglePopupBy.Hover:
                setTooglePopupBy(TogglePopupBy.Click);
                toggle(ToggleStatus.Open);
                break;
        }
    };

    const openOnHover = (): void => {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Open);
    };

    const closeOnHover = (): void => {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Close);
    };

    return {
        opened,
        closeOnHover,
        openOnHover,
        toggleOnClick,
    };
};
