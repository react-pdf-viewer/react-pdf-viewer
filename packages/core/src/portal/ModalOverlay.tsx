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
}> = ({ children }) => <div className={styles.overlay}>{children}</div>;
