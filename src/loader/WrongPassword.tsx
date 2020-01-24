/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import { VerifyPassword } from './LoadingStatus';

interface WrongPasswordProps {
    verifyPasswordFn: VerifyPassword;
}

const WrongPassword: React.FC<WrongPasswordProps> = ({ verifyPasswordFn }) => {
    const l10n = React.useContext(LocalizationContext);
    const [password, setPassword] = React.useState('');

    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const submit = () => {
        verifyPasswordFn(password);
    };

    return (
        <div
            style={{
                alignItems: 'center',
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            <div>
                <div style={{ margin: '8px 0' }}>{l10n.wrongPassword.tryAgain}:</div>
                <input
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        padding: '8px',
                    }}
                    type="password"
                    onChange={changePassword}
                />
                <div style={{ margin: '8px 0' }}>
                    <button
                        style={{
                            backgroundColor: '#357EDD',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#FFF',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}
                        onClick={submit}
                    >
                        {l10n.wrongPassword.submit}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WrongPassword;
