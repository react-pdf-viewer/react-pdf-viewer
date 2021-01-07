/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import LoadingStatus, { VerifyPassword } from './LoadingStatus';

class WrongPasswordState extends LoadingStatus {
    public verifyPasswordFn: VerifyPassword;

    constructor(verifyPasswordFn: VerifyPassword) {
        super();
        this.verifyPasswordFn = verifyPasswordFn;
    }
}

export default WrongPasswordState;
