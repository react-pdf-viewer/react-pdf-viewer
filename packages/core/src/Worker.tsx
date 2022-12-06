/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Spinner } from './components/Spinner';
import type { PdfJsApiProvider } from './types/PdfJsApiProvider';
import { PdfJsApiContext } from './vendors/PdfJsApiContext';

export const Worker: React.FC<{
    children?: React.ReactNode;
    pdfJsLegacy?: boolean;
    workerUrl: string;
}> = ({ children, pdfJsLegacy = false, workerUrl }) => {
    const [apiProvider, setApiProvider] = React.useState<PdfJsApiProvider>();

    const setProvider = React.useCallback(
        (api: PdfJsApiProvider) => {
            api.GlobalWorkerOptions.workerSrc = workerUrl;
            setApiProvider(api);
        },
        [workerUrl]
    );

    React.useEffect(() => {
        if (pdfJsLegacy) {
            import('pdfjs-dist/legacy/build/pdf').then((result: unknown) => {
                setProvider(result as PdfJsApiProvider);
            });
        } else {
            import('pdfjs-dist').then((result: unknown) => {
                setProvider(result as PdfJsApiProvider);
            });
        }
    }, [pdfJsLegacy]);

    return apiProvider ? (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>{children}</PdfJsApiContext.Provider>
    ) : (
        <Spinner />
    );
};
