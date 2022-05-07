import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/drop/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '../styles/index.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.js">
            <Component {...pageProps} />
        </Worker>
    );
}
