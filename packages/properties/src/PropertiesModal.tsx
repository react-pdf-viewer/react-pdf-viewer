/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Button, LocalizationContext, Separator } from '@react-pdf-viewer/core';
import type { PdfJs } from '@react-pdf-viewer/core';

import { PropertiesLoader } from './PropertiesLoader';
import { PropertyItem } from './PropertyItem';
import { convertDate } from './utils/convertDate';
import { getFileName } from './utils/getFileName';
import { getFileSize } from './utils/getFileSize';
import type { PropertiesData } from './types/PropertiesData';

export const PropertiesModal: React.FC<{
    doc: PdfJs.PdfDocument;
    fileName: string;
    onToggle(): void;
}> = ({ doc, fileName, onToggle }) => {
    const l10n = React.useContext(LocalizationContext);

    const formatDate = (input: string): string => {
        const date = convertDate(input);
        return date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : '';
    };

    const renderData = (data: PropertiesData): React.ReactElement => (
        <>
            <div className="rpv-properties__modal-section">
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.fileName : 'File name') as string}
                    value={data.fileName || getFileName(fileName)}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.fileSize : 'File size') as string}
                    value={getFileSize(data.length)}
                />
            </div>
            <Separator />
            <div className="rpv-properties__modal-section">
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.title : 'Title') as string}
                    value={data.info.Title}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.author : 'Author') as string}
                    value={data.info.Author}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.subject : 'Subject') as string}
                    value={data.info.Subject}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.keywords : 'Keywords') as string}
                    value={data.info.Keywords}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.creator : 'Creator') as string}
                    value={data.info.Creator}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.creationDate : 'Creation date') as string}
                    value={formatDate(data.info.CreationDate)}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.modificationDate : 'Modification date') as string}
                    value={formatDate(data.info.ModDate)}
                />
            </div>
            <Separator />
            <div className="rpv-properties__modal-section">
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.pdfProducer : 'PDF producer') as string}
                    value={data.info.Producer}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.pdfVersion : 'PDF version') as string}
                    value={data.info.PDFFormatVersion}
                />
                <PropertyItem
                    label={(l10n && l10n.properties ? l10n.properties.pageCount : 'Page count') as string}
                    value={`${doc.numPages}`}
                />
            </div>
        </>
    );

    return (
        <div className="rpv-properties__modal">
            <PropertiesLoader doc={doc} render={renderData} />
            <div className="rpv-properties__modal-footer">
                <Button onClick={onToggle}>{l10n && l10n.properties ? l10n.properties.close : 'Close'}</Button>
            </div>
        </div>
    );
};
