/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { Spinner, type PdfJs } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type PropertiesData } from './types/PropertiesData';

export const PropertiesLoader: React.FC<{
    doc: PdfJs.PdfDocument;
    render(doc: PropertiesData): React.ReactElement;
}> = ({ doc, render }) => {
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
