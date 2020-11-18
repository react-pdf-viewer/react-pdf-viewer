/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Plugin } from '@react-pdf-viewer/core';

interface HighlightPlugin extends Plugin {
}

const highlightPlugin = (): HighlightPlugin => {
    return {
    };
};

export default highlightPlugin;
