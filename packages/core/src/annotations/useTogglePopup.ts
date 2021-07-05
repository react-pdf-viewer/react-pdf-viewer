/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useToggle, { ToggleStatus } from '../hooks/useToggle';

enum TogglePopupBy {
    Click = 'Click',
    Hover = 'Hover',
}

interface UsePopupResult {
    opened: boolean;
    closeOnHover: () => void;
    openOnHover: () => void;
    toggleOnClick: () => void;
}

const useTogglePopup = (): UsePopupResult => {
    const { opened, toggle } = useToggle();
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

export default useTogglePopup;
