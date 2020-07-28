/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC } from 'react';
import { MenuItem } from '@phuocng/rpv';

import { RenderShowPropertiesProps } from './ShowProperties';

const ShowPropertiesMenuItem: FC<RenderShowPropertiesProps> = ({ icon, label, onClick }) => (
    <MenuItem icon={icon} onClick={onClick}>{label}</MenuItem>
);

export default ShowPropertiesMenuItem;
