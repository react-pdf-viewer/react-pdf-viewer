/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/react-pdf-viewer.min.js');
} else {
    module.exports = require('./cjs/react-pdf-viewer.js');
}
