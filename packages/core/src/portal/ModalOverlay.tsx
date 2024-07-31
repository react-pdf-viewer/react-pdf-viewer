/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import styles from '../styles/modalOverlay.module.css';

export const ModalOverlay: React.FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const ele = ref.current;
        if (!ele) {
            return;
        }
        // Fade in the overlay
        const animation = ele.animate(
            [
                {
                    background: 'rgba(0, 0, 0, 1)',
                    opacity: 0,
                },
                {
                    background: 'rgba(0, 0, 0, 0.8)',
                    opacity: 1,
                },
            ],
            {
                duration: 150,
                fill: 'forwards',
            }
        );
        return () => {
            animation.cancel();
        };
    }, []);

    return (
        <div className={styles.overlay} ref={ref}>
            {children}
        </div>
    );
};
