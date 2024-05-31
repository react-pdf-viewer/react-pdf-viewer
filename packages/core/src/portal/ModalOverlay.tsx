/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const ModalOverlay: React.FC<{
    children?: React.ReactNode;
}> = ({ children }) => <div className="rpv-core__modal-overlay">{children}</div>;
