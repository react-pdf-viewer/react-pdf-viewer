/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, ReactElement, useEffect, useState } from 'react';
import { PdfJs, Spinner } from '@phuocng/rpv';

import PropertiesData from './PropertiesData';
import './propertiesLoader.less';

interface PropertiesLoaderProps {
    doc: PdfJs.PdfDocument;
    render(doc: PropertiesData): ReactElement;
}

const PropertiesLoader: FC<PropertiesLoaderProps> = ({ doc, render }) => {
    const [data, setData] = useState<PropertiesData>();

    useEffect(() => {
        doc.getMetadata().then((meta) => {
            return Promise.resolve(meta);
        }).then((meta) => {
            return doc.getDownloadInfo().then((d) => {
                return Promise.resolve({
                    fileName: meta.contentDispositionFilename || '',
                    info: meta.info,
                    length: d.length,
                });
            });
        }).then((response) => {
            setData(response);
        });
    }, []);

    return (
        data ? render(data) : <div className='rpv-properties-loader'><Spinner /></div>
    );
};

export default PropertiesLoader;
