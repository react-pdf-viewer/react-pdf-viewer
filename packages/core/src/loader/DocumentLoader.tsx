/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { Spinner } from '../components/Spinner';
import { useIsMounted } from '../hooks/useIsMounted';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import { PdfJsApi } from '../vendors/PdfJsApi';
import { CharacterMap } from '../Viewer';
import { AskForPasswordState } from './AskForPasswordState';
import { AskingPassword } from './AskingPassword';
import { CompletedState } from './CompletedState';
import { FailureState } from './FailureState';
import { LoadingState } from './LoadingState';
import { LoadingStatus } from './LoadingStatus';
import { WrongPassword } from './WrongPassword';
import { WrongPasswordState } from './WrongPasswordState';
import type { DocumentAskPasswordEvent, VerifyPassword } from '../types/DocumentAskPasswordEvent';
import type { LoadError } from './LoadError';
import type { PdfJs } from '../types/PdfJs';

export type RenderError = (error: LoadError) => React.ReactElement;

export const DocumentLoader: React.FC<{
    characterMap?: CharacterMap;
    file: PdfJs.FileData;
    httpHeaders?: Record<string, string | string[]>;
    render(doc: PdfJs.PdfDocument): React.ReactElement;
    renderError?: RenderError;
    renderLoader?(percentages: number): React.ReactElement;
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
    transformGetDocumentParams,
    withCredentials,
    onDocumentAskPassword,
}) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const [status, setStatus] = React.useState<LoadingStatus>(new LoadingState(0));

    const [percentages, setPercentages] = React.useState(0);
    const [loadedDocument, setLoadedDocument] = React.useState<PdfJs.PdfDocument>(null);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        // If we don't reset the status when new `file` is provided
        // (for example, when opening file)
        // then we will see the error
        //  ```
        //  Invariant Violation: Rendered fewer hooks than expected.
        //  This may be caused by an accidental early return statement
        //  ```
        setStatus(new LoadingState(0));

        // Create a new worker
        const worker = new PdfJsApi.PDFWorker({ name: `PDFWorker_${Date.now()}` }) as PdfJs.PDFWorker;

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
                : {}
        );
        const transformParams = transformGetDocumentParams ? transformGetDocumentParams(params) : params;

        const loadingTask = PdfJsApi.getDocument(transformParams) as unknown as PdfJs.LoadingTask;
        loadingTask.onPassword = (verifyPassword: VerifyPassword, reason: number): void => {
            switch (reason) {
                case PdfJsApi.PasswordResponses.NEED_PASSWORD:
                    isMounted.current && setStatus(new AskForPasswordState(verifyPassword));
                    break;
                case PdfJsApi.PasswordResponses.INCORRECT_PASSWORD:
                    isMounted.current && setStatus(new WrongPasswordState(verifyPassword));
                    break;
                default:
                    break;
            }
        };
        loadingTask.onProgress = (progress) => {
            progress.total > 0
                ? // It seems weird but there is a case that `loaded` is greater than `total`
                  isMounted.current && setPercentages(Math.min(100, (100 * progress.loaded) / progress.total))
                : isMounted.current && setPercentages(100);
        };
        loadingTask.promise.then(
            (doc) => isMounted.current && setLoadedDocument(doc),
            (err) =>
                isMounted.current &&
                !worker.destroyed &&
                setStatus(
                    new FailureState({
                        message: err.message || 'Cannot load document',
                        name: err.name,
                    })
                )
        );

        return (): void => {
            loadingTask.destroy();
            worker.destroy();
        };
    }, [file]);

    // There is a case that `loadingTask.promise()` is already resolved but `loadingTask.onProgress` is still triggered
    // (numOfPercentages does not reach 100 yet)
    // So, we have to check both `percentages` and `loaded`
    React.useEffect(() => {
        percentages === 100 && loadedDocument
            ? isMounted.current && setStatus(new CompletedState(loadedDocument))
            : isMounted.current && setStatus(new LoadingState(percentages));
    }, [percentages, loadedDocument]);

    if (status instanceof AskForPasswordState) {
        return <AskingPassword verifyPassword={status.verifyPassword} onDocumentAskPassword={onDocumentAskPassword} />;
    }
    if (status instanceof WrongPasswordState) {
        return <WrongPassword verifyPassword={status.verifyPassword} onDocumentAskPassword={onDocumentAskPassword} />;
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
                    'rpv-core__doc-error': true,
                    'rpv-core__doc-error--rtl': isRtl,
                })}
            >
                <div className="rpv-core__doc-error-text">{(status as FailureState).error.message}</div>
            </div>
        );
    }
    if (status instanceof LoadingState) {
        return (
            <div
                className={classNames({
                    'rpv-core__doc-loading': true,
                    'rpv-core__doc-loading--rtl': isRtl,
                })}
            >
                {renderLoader ? renderLoader((status as LoadingState).percentages) : <Spinner />}
            </div>
        );
    }

    return (
        <div className="rpv-core__doc-loading">
            <Spinner />
        </div>
    );
};
