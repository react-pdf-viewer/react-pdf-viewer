/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { PrimaryButton } from '../components/PrimaryButton';
import { TextBox } from '../components/TextBox';
import { LocalizationContext } from '../localization/LocalizationContext';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import type { VerifyPassword } from './LoadingStatus';

export const WrongPassword: React.FC<{
    verifyPasswordFn: VerifyPassword;
}> = ({ verifyPasswordFn }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const [password, setPassword] = React.useState('');
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const submit = (): void => verifyPasswordFn(password);

    return (
        <div className="rpv-core__asking-password-wrapper">
            <div className="rpv-core__asking-password">
                <div className="rpv-core__asking-password-message">{l10n.core.wrongPassword.tryAgain}:</div>
                <div
                    className={classNames({
                        'rpv-core__asking-password-body': true,
                        'rpv-core__asking-password-body--rtl': isRtl,
                    })}
                >
                    <div
                        className={classNames({
                            'rpv-core__asking-password-input': true,
                            'rpv-core__asking-password-input--ltr': !isRtl,
                            'rpv-core__asking-password-input--rtl': isRtl,
                        })}
                    >
                        <TextBox type="password" value={password} onChange={setPassword} />
                    </div>
                    <PrimaryButton onClick={submit}>{l10n.core.wrongPassword.submit}</PrimaryButton>
                </div>
            </div>
        </div>
    );
};
