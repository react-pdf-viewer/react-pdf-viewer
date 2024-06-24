import { Provider, Spinner, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/drop/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import * as React from 'react';
import '../styles/index.css';

export default function MyApp({ Component, pageProps }) {
    const [apiProvider, setApiProvider] = React.useState<PdfJsApiProvider>();

    // A workaround to get rid of the issue
    // `Promise.withResolvers` is not a function
    React.useEffect(() => {
        import('pdfjs-dist').then((module) => {
            setApiProvider(module as unknown as PdfJsApiProvider);
        });
    }, []);

    return apiProvider ? (
        <Provider pdfApiProvider={apiProvider} workerUrl="/pdf.worker.min.mjs">
            <Component {...pageProps} />
        </Provider>
    ) : (
        <Spinner />
    );
}
