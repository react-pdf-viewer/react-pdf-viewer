/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/full-screen.min.js');
} else {
    module.exports = require('./cjs/full-screen.js');
}
