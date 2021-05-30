/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import { VerifyPassword } from './LoadingStatus';

interface WrongPasswordProps {
    verifyPasswordFn: VerifyPassword;
}

const WrongPassword: React.FC<WrongPasswordProps> = ({ verifyPasswordFn }) => {
    const l10n = React.useContext(LocalizationContext);
    const [password, setPassword] = React.useState('');

    const changePassword = (e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
    const submit = (): void => verifyPasswordFn(password);

    return (
        <div className='rpv-core__asking-password'>
            <div>
                <div className='rpv-core__asking-password-message'>{l10n.core.wrongPassword.tryAgain}:</div>
                <div className='rpv-core__asking-password-body'>
                    <input
                        className='rpv-core__asking-password-input'
                        type="password"
                        onChange={changePassword}
                    />
                    <button className='rpv-core__asking-password-button' onClick={submit}>
                        {l10n.core.wrongPassword.submit}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WrongPassword;
