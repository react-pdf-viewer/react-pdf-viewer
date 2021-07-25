/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const TextBox: React.FC<{
    ariaLabel?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}> = ({ ariaLabel = '', placeholder = '', type = 'text', value = '', onChange, onKeyDown = () => {} }) => (
    <input
        aria-label={ariaLabel}
        className="rpv-core__textbox"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
    />
);
