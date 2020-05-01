/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import ThemeContext from '../theme/ThemeContext';
import { VerifyPassword } from './LoadingStatus';
import './askingPassword.less';

interface WrongPasswordProps {
    verifyPasswordFn: VerifyPassword;
}

const WrongPassword: React.FC<WrongPasswordProps> = ({ verifyPasswordFn }) => {
    const l10n = React.useContext(LocalizationContext);
    const theme = React.useContext(ThemeContext);
    const [password, setPassword] = React.useState('');

    const changePassword = (e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
    const submit = (): void => verifyPasswordFn(password);

    return (
        <div className={`${theme.prefixClass}-asking-password`}>
            <div>
                <div className={`${theme.prefixClass}-asking-password-message`}>{l10n.wrongPassword.tryAgain}:</div>
                <div className={`${theme.prefixClass}-asking-password-input-container`}>
                    <input
                        className={`${theme.prefixClass}-asking-password-input`}
                        type="password"
                        onChange={changePassword}
                    />
                    <button className={`${theme.prefixClass}-asking-password-button`} onClick={submit}>
                        {l10n.wrongPassword.submit}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WrongPassword;
