/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, Spinner } from '@react-pdf-viewer/core';

import PropertiesData from './PropertiesData';

interface PropertiesLoaderProps {
    doc: PdfJs.PdfDocument;
    render(doc: PropertiesData): React.ReactElement;
}

const PropertiesLoader: React.FC<PropertiesLoaderProps> = ({ doc, render }) => {
    const [data, setData] = React.useState<PropertiesData>();

    React.useEffect(() => {
        doc.getMetadata()
            .then((meta) => {
                return Promise.resolve(meta);
            })
            .then((meta) => {
                return doc.getDownloadInfo().then((d) => {
                    return Promise.resolve({
                        fileName: meta.contentDispositionFilename || '',
                        info: meta.info,
                        length: d.length,
                    });
                });
            })
            .then((response) => {
                setData(response);
            });
    }, []);

    return data ? (
        render(data)
    ) : (
        <div className="rpv-properties__loader">
            <Spinner />
        </div>
    );
};

export default PropertiesLoader;
