/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ProgressBar } from '../components/ProgressBar';
import { Spinner } from '../components/Spinner';
import { useIsMounted } from '../hooks/useIsMounted';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import type { DocumentAskPasswordEvent, VerifyPassword } from '../types/DocumentAskPasswordEvent';
import type { PdfJs } from '../types/PdfJs';
import { classNames } from '../utils/classNames';
import { PdfJsApi } from '../vendors/PdfJsApi';
import { CharacterMap } from '../Viewer';
import { AskForPasswordState, SubmitPassword } from './AskForPasswordState';
import { AskingPassword } from './AskingPassword';
import { CompletedState } from './CompletedState';
import { FailureState } from './FailureState';
import type { LoadError } from './LoadError';
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
    const docRef = React.useRef<string>('');
    const [loadedDocument, setLoadedDocument] = React.useState<PdfJs.PdfDocument>(null);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        // Reset the status when new `file` is provided (for example, when opening file from the toolbar)
        docRef.current = '';
        setStatus(new LoadingState(0));

        // Create a new worker
        const worker = new PdfJsApi.PDFWorker({ name: `PDFWorker_${Date.now()}` as any }) as PdfJs.PDFWorker;

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

        const loadingTask = PdfJsApi.getDocument(transformParams as any) as unknown as PdfJs.LoadingTask;
        loadingTask.onPassword = (verifyPassword: VerifyPassword, reason: number): void => {
            switch (reason) {
                case PdfJsApi.PasswordResponses.NEED_PASSWORD:
                    isMounted.current &&
                        setStatus(new AskForPasswordState(verifyPassword, SubmitPassword.REQUIRE_PASSWORD));
                    break;
                case PdfJsApi.PasswordResponses.INCORRECT_PASSWORD:
                    isMounted.current &&
                        setStatus(new AskForPasswordState(verifyPassword, SubmitPassword.WRONG_PASSWORD));
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
            if (isMounted.current && docRef.current === '') {
                setStatus(new LoadingState(loaded));
            }
        };
        loadingTask.promise.then(
            (doc) => {
                docRef.current = doc.loadingTask.docId;
                isMounted.current && setStatus(new CompletedState(doc));
            },
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

    if (status instanceof AskForPasswordState) {
        return (
            <AskingPassword
                submitPassword={status.submitPassword}
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
                    'rpv-core__doc-error': true,
                    'rpv-core__doc-error--rtl': isRtl,
                })}
            >
                <div className="rpv-core__doc-error-text">{(status as FailureState).error.message}</div>
            </div>
        );
    }

    return (
        <div
            data-testid="core__doc-loading"
            className={classNames({
                'rpv-core__doc-loading': true,
                'rpv-core__doc-loading--rtl': isRtl,
            })}
        >
            {renderLoader ? renderLoader((status as LoadingState).percentages) : <Spinner />}
        </div>
    );
};
