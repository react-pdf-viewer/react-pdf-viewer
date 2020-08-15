/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext } from 'react';
import { LocalizationContext, PdfJs, PrimaryButton, Separator } from '@react-pdf-viewer/core';

import PropertiesData from './PropertiesData';
import PropertiesLoader from './PropertiesLoader';
import './propertiesModal.less';
import PropertyItem from './PropertyItem';
import convertDate from './utils/convertDate';
import getFileName from './utils/fileName';
import getFileSize from './utils/fileSize';

interface PropertiesModalProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    onToggle(): void;
}

const PropertiesModal: FC<PropertiesModalProps> = ({ doc, fileName, onToggle }) => {
    const l10n = useContext(LocalizationContext);

    const formatDate = (input: string): string => {
        const date = convertDate(input);
        return date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : '';
    };

    const renderData = (data: PropertiesData): React.ReactElement => (
        <>
            <div className='rpv-properties-modal-group'>
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.fileName : 'File name') as string}
                    value={data.fileName || getFileName(fileName)}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.fileSize : 'File size') as string}
                    value={getFileSize(data.length)}
                />
            </div>
            <Separator />
            <div className='rpv-properties-modal-group'>
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.title : 'Title') as string}
                    value={data.info.Title}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.author : 'Author') as string}
                    value={data.info.Author}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.subject : 'Subject') as string}
                    value={data.info.Subject}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.keywords : 'Keywords') as string}
                    value={data.info.Keywords}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.creator : 'Creator') as string}
                    value={data.info.Creator}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.creationDate : 'Creation date') as string}
                    value={formatDate(data.info.CreationDate)}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.modificationDate : 'Modification date') as string}
                    value={formatDate(data.info.ModDate)}
                />
            </div>
            <Separator />
            <div className='rpv-properties-modal-group'>
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.pdfProducer : 'PDF producer') as string}
                    value={data.info.Producer}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.pdfVersion : 'PDF version') as string}
                    value={data.info.PDFFormatVersion}
                />
                <PropertyItem
                    label={(l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.pageCount : 'Page count') as string}
                    value={`${doc.numPages}`}
                />
            </div>
        </>
    );

    return (
        <div className='rpv-properties-modal'>
            <PropertiesLoader
                doc={doc}
                render={renderData}
            />
            <div className='rpv-properties-modal-footer'>
                <PrimaryButton onClick={onToggle}>
                    {l10n && l10n.plugins && l10n.plugins.properties ? l10n.plugins.properties.close : 'Close'}
                </PrimaryButton>
            </div>
        </div>
    );
};

export default PropertiesModal;
