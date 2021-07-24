import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import '../styles/index.css';

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
