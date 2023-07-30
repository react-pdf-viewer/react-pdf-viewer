import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/drop/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/worker';
import '../styles/index.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <Worker workerUrl="/pdf.worker.min.js">
            <Component {...pageProps} />
        </Worker>
    );
}
