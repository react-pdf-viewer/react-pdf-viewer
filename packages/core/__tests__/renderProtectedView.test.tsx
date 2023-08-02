import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import {
    PasswordStatus,
    PdfJsApiContext,
    PrimaryButton,
    TextBox,
    Viewer,
    type PdfJsApiProvider,
    type RenderProtectedViewProps,
} from '../src';

const ProtectedView: React.FC<RenderProtectedViewProps> = ({ passwordStatus, verifyPassword }) => {
    const [password, setPassword] = React.useState('');
    const submit = (): void => verifyPassword(password);

    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
            }}
        >
            <div
                style={{
                    width: '20rem',
                }}
            >
                <div
                    style={{
                        marginBottom: '0.5rem',
                    }}
                >
                    <TextBox
                        placeholder="Enter the password ..."
                        testId="password-input"
                        type="password"
                        value={password}
                        onChange={setPassword}
                    />
                </div>
                {passwordStatus === PasswordStatus.WrongPassword && (
                    <div
                        data-testid="error"
                        style={{
                            color: '#c02424',
                            marginBottom: '0.5rem',
                        }}
                    >
                        The password is invalid. Please try again!
                    </div>
                )}
                <PrimaryButton testId="submit-button" onClick={submit}>
                    Submit
                </PrimaryButton>
            </div>
        </div>
    );
};

const TestProtectedView = () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '50rem', width: '50rem' }}>
                <Viewer fileUrl={global['__SAMPLE_PROTECTED_PDF__']} renderProtectedView={ProtectedView} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Customize the view of a protected document', async () => {
    const { findByTestId, getByTestId } = render(<TestProtectedView />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    // Enter a wrong password
    const passwordInput = await findByTestId('password-input');
    fireEvent.change(passwordInput, {
        target: {
            value: '123',
        },
    });
    const submitButton = await findByTestId('submit-button');
    fireEvent.click(submitButton);

    const error = await findByTestId('error');
    expect(error.textContent).toEqual('The password is invalid. Please try again!');

    // Enter the correct password
    fireEvent.change(passwordInput, {
        target: {
            value: '123456',
        },
    });
    fireEvent.click(submitButton);

    const textLayer = await findByTestId('core__text-layer-0');
    const textElements = textLayer.querySelectorAll('.rpv-core__text-layer-text');
    const numTexts = textElements.length;
    expect(numTexts).toEqual(75);
});
