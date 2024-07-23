/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { Spinner } from '../components/Spinner';
import { useSafeState } from '../hooks/useSafeState';
import { PasswordStatus } from '../structs/PasswordStatus';
import styles from '../styles/documentLoader.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { type CharacterMap } from '../types/CharacterMap';
import { type DocumentAskPasswordEvent } from '../types/DocumentAskPasswordEvent';
import { type PdfJs } from '../types/PdfJs';
import { type RenderProtectedView } from '../types/RenderProtectedView';
import { classNames } from '../utils/classNames';
import { PdfJsApiContext } from '../vendors/PdfJsApiContext';
import { AskForPasswordState } from './AskForPasswordState';
import { AskingPassword } from './AskingPassword';
import { CompletedState } from './CompletedState';
import { FailureState } from './FailureState';
import { type LoadError } from './LoadError';
import { LoadingState } from './LoadingState';
import { LoadingStatus } from './LoadingStatus';

export type RenderError = (error: LoadError) => React.ReactElement;

export const DocumentLoader: React.FC<{
    characterMap?: CharacterMap;
    file: PdfJs.FileData;
    httpHeaders?: Record<string, string | string[]>;
    render(doc: PdfJs.PdfDocument): React.ReactElement;
    renderError?: RenderError;
    renderLoader?(percentages: number): React.ReactElement;
    renderProtectedView?: RenderProtectedView;
    transformGetDocumentParams?(options: PdfJs.GetDocumentParams): PdfJs.GetDocumentParams;
    withCredentials: boolean;
    onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
}> = ({
    characterMap,
    file,
    httpHeaders,
    render,
    renderError,
    renderLoader,
    renderProtectedView,
    transformGetDocumentParams,
    withCredentials,
    onDocumentAskPassword,
}) => {
    const { pdfJsApiProvider } = React.useContext(PdfJsApiContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const [status, setStatus] = useSafeState<LoadingStatus>(new LoadingState(0));
    const docRef = React.useRef<string>('');

    React.useEffect(() => {
        if (!pdfJsApiProvider) {
            return;
        }
        // Reset the status when new `file` is provided (for example, when opening file from the toolbar)
        docRef.current = '';
        setStatus(new LoadingState(0));

        // Create a new worker
        const worker = new pdfJsApiProvider.PDFWorker({ name: `PDFWorker_${Date.now()}` as any }) as PdfJs.PDFWorker;

        const params: PdfJs.GetDocumentParams = Object.assign(
            {
                httpHeaders,
                withCredentials,
                worker,
            },
            'string' === typeof file ? { url: file } : { data: file },
            characterMap
                ? {
                      cMapUrl: characterMap.url,
                      cMapPacked: characterMap.isCompressed,
                  }
                : {},
        );
        const transformParams = transformGetDocumentParams ? transformGetDocumentParams(params) : params;

        const loadingTask = pdfJsApiProvider.getDocument(transformParams as any) as unknown as PdfJs.LoadingTask;
        loadingTask.onPassword = (verifyPassword: (password: string) => void, reason: number): void => {
            switch (reason) {
                case pdfJsApiProvider.PasswordResponses.NEED_PASSWORD:
                    setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.RequiredPassword));
                    break;
                case pdfJsApiProvider.PasswordResponses.INCORRECT_PASSWORD:
                    setStatus(new AskForPasswordState(verifyPassword, PasswordStatus.WrongPassword));
                    break;
                default:
                    break;
            }
        };
        loadingTask.onProgress = (progress) => {
            const loaded =
                progress.total > 0
                    ? // It seems weird but there is a case that `loaded` is greater than `total`
                      Math.min(100, (100 * progress.loaded) / progress.total)
                    : 100;
            if (docRef.current === '') {
                setStatus(new LoadingState(loaded));
            }
        };
        loadingTask.promise.then(
            (doc) => {
                docRef.current = doc.loadingTask.docId;
                setStatus(new CompletedState(doc));
            },
            (err) =>
                !worker.destroyed &&
                setStatus(
                    new FailureState({
                        message: err.message || 'Cannot load document',
                        name: err.name,
                    }),
                ),
        );

        return (): void => {
            loadingTask.destroy();
            worker.destroy();
        };
    }, [file]);

    if (status instanceof AskForPasswordState) {
        return (
            <AskingPassword
                passwordStatus={status.passwordStatus}
                renderProtectedView={renderProtectedView}
                verifyPassword={status.verifyPassword}
                onDocumentAskPassword={onDocumentAskPassword}
            />
        );
    }
    if (status instanceof CompletedState) {
        return render((status as CompletedState).doc);
    }
    if (status instanceof FailureState) {
        return renderError ? (
            renderError((status as FailureState).error)
        ) : (
            <div
                className={classNames({
                    [styles.error]: true,
                    [styles.errorRtl]: isRtl,
                })}
            >
                <div className={styles.errorText}>{(status as FailureState).error.message}</div>
            </div>
        );
    }

    return (
        <div
            data-testid="core__doc-loading"
            className={classNames({
                [styles.loading]: true,
                [styles.loadingRtl]: isRtl,
            })}
        >
            {renderLoader ? renderLoader((status as LoadingState).percentages) : <Spinner />}
        </div>
    );
};
