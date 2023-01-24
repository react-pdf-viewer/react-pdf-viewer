/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { LoadingStatus } from './LoadingStatus';
import { PasswordStatus } from '../structs/PasswordStatus';

export class AskForPasswordState extends LoadingStatus {
    public verifyPassword: (password: string) => void;
    public passwordStatus: PasswordStatus;

    constructor(verifyPassword: (password: string) => void, passwordStatus: PasswordStatus) {
        super();
        this.verifyPassword = verifyPassword;
        this.passwordStatus = passwordStatus;
    }
}
