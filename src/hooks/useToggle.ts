/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

enum ToggleStatus {
    Close = 'Close',
    Open = 'Open',
    Toggle = 'Toggle',
}
type Toggle = (status?: ToggleStatus) => void;

const useToggle = () => {
    const [opened, setOpened] = React.useState(false);
    const toggle: Toggle = (status?: ToggleStatus) => {
        switch (status) {
            case ToggleStatus.Close:
                setOpened(false);
                break;
            case ToggleStatus.Open:
                setOpened(true);
                break;
            case ToggleStatus.Toggle:
            default:
                setOpened((isOpened) => !isOpened);
                break;
        }
    };

    return { opened, toggle };
};

export { Toggle, ToggleStatus };
export default useToggle;
