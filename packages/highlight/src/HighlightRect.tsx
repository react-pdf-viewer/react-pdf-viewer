/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { getCssProperties } from './transformArea';
import { type HighlightArea } from './types/HighlightArea';

export const HighlightRect: React.FC<{
    area: HighlightArea;
    rotation: number;
}> = ({ area, rotation }) => <div className="rpv-highlight__selected-text" style={getCssProperties(area, rotation)} />;
