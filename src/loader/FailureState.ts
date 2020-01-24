/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import LoadingStatus from './LoadingStatus';

class FailureState extends LoadingStatus {
    public error: string;

    constructor(error: string) {
        super();
        this.error = error;
    }
}

export default FailureState;
