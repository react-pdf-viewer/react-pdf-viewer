import { Provider, Spinner, TextDirection, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import '../styles/index.css';

export default function MyApp({ Component, pageProps }) {
    const searchParams = useSearchParams();
    const direction = searchParams.get('direction') === 'rtl' ? TextDirection.RightToLeft : TextDirection.LeftToRight;
    const [apiProvider, setApiProvider] = React.useState<PdfJsApiProvider>();

    // A workaround to get rid of the issue
    // `Promise.withResolvers` is not a function
    React.useEffect(() => {
        import('pdfjs-dist').then((module) => {
            setApiProvider(module as unknown as PdfJsApiProvider);
        });
    }, []);

    return apiProvider ? (
        <Provider
            pdfApiProvider={apiProvider}
            theme={{
                direction,
            }}
            workerUrl="/pdf.worker.min.mjs"
        >
            <Component {...pageProps} />
        </Provider>
    ) : (
        <Spinner />
    );
}
