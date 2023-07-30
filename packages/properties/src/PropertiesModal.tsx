/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Button, LocalizationContext, Separator, type LocalizationMap, type PdfJs } from '@react-pdf-viewer/core';
import * as React from 'react';
import { PropertiesLoader } from './PropertiesLoader';
import { PropertyItem } from './PropertyItem';
import { type PropertiesData } from './types/PropertiesData';
import { convertDate } from './utils/convertDate';
import { getFileName } from './utils/getFileName';
import { getFileSize } from './utils/getFileSize';

export const PropertiesModal: React.FC<{
    doc: PdfJs.PdfDocument;
    fileName: string;
    onToggle(): void;
}> = ({ doc, fileName, onToggle }) => {
    const { l10n } = React.useContext(LocalizationContext);

    const formatDate = (input: string): string => {
        const date = convertDate(input);
        return date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : '';
    };

    const renderData = (data: PropertiesData): React.ReactElement => (
        <>
            <div className="rpv-properties__modal-section">
                <PropertyItem
                    label={
                        l10n && l10n.properties
                            ? ((l10n.properties as LocalizationMap).fileName as string)
                            : 'File name'
                    }
                    value={data.fileName || getFileName(fileName)}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties
                            ? ((l10n.properties as LocalizationMap).fileSize as string)
                            : 'File size'
                    }
                    value={getFileSize(data.length)}
                />
            </div>
            <Separator />
            <div className="rpv-properties__modal-section">
                <PropertyItem
                    label={l10n && l10n.properties ? ((l10n.properties as LocalizationMap).title as string) : 'Title'}
                    value={data.info.Title}
                />
                <PropertyItem
                    label={l10n && l10n.properties ? ((l10n.properties as LocalizationMap).author as string) : 'Author'}
                    value={data.info.Author}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties ? ((l10n.properties as LocalizationMap).subject as string) : 'Subject'
                    }
                    value={data.info.Subject}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties ? ((l10n.properties as LocalizationMap).keywords as string) : 'Keywords'
                    }
                    value={data.info.Keywords}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties ? ((l10n.properties as LocalizationMap).creator as string) : 'Creator'
                    }
                    value={data.info.Creator}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties
                            ? ((l10n.properties as LocalizationMap).creationDate as string)
                            : 'Creation date'
                    }
                    value={formatDate(data.info.CreationDate)}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties
                            ? ((l10n.properties as LocalizationMap).modificationDate as string)
                            : 'Modification date'
                    }
                    value={formatDate(data.info.ModDate)}
                />
            </div>
            <Separator />
            <div className="rpv-properties__modal-section">
                <PropertyItem
                    label={
                        l10n && l10n.properties
                            ? ((l10n.properties as LocalizationMap).pdfProducer as string)
                            : 'PDF producer'
                    }
                    value={data.info.Producer}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties
                            ? ((l10n.properties as LocalizationMap).pdfVersion as string)
                            : 'PDF version'
                    }
                    value={data.info.PDFFormatVersion}
                />
                <PropertyItem
                    label={
                        l10n && l10n.properties
                            ? ((l10n.properties as LocalizationMap).pageCount as string)
                            : 'Page count'
                    }
                    value={`${doc.numPages}`}
                />
            </div>
        </>
    );

    return (
        <div className="rpv-properties__modal">
            <PropertiesLoader doc={doc} render={renderData} />
            <div className="rpv-properties__modal-footer">
                <Button onClick={onToggle}>
                    {l10n && l10n.properties ? ((l10n.properties as LocalizationMap).close as string) : 'Close'}
                </Button>
            </div>
        </div>
    );
};
