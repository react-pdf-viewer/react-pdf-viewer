/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useRef, useState } from 'react';
import { PdfJs } from '@phuocng/rpv';

import './searchPopover.less';

interface SearchPopoverProps {
    doc: PdfJs.PdfDocument;
    onToggle(): void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({ doc, onToggle }) => {
    return (
        <div>Search popover</div>
    );
};

export default SearchPopover;
