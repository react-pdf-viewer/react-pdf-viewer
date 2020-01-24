/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import PdfJs from '../PdfJs';
import convertDate from '../utils/convertDate';
import getFileName from '../utils/fileName';
import getFileSize from '../utils/fileSize';
import PropertiesData from './PropertiesData';
import PropertiesLoader from './PropertiesLoader';
import PropertyItem from './PropertyItem';

interface PropertiesModalProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    onToggle(): void;
}

const PropertiesModal: React.FC<PropertiesModalProps> = ({ doc, fileName, onToggle }) => {
    const l10n = React.useContext(LocalizationContext);

    const formatDate = (input: string) => {
        const date = convertDate(input);
        return date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : '';
    };

    const renderData = (data: PropertiesData) => (
        <>
            <div style={{ padding: '0 8px '}}>
                <PropertyItem label={`${l10n.property.fileName}`} value={data.fileName || getFileName(fileName)} />
                <PropertyItem label={`${l10n.property.fileSize}`} value={getFileSize(data.length)} />
            </div>
            <div style={{ borderBottom: '1px solid rgba(0, 0, 0, .3)' }} />
            <div style={{ padding: '0 8px '}}>
                <PropertyItem label={`${l10n.property.title}`} value={data.info.Title} />
                <PropertyItem label={`${l10n.property.author}`} value={data.info.Author} />
                <PropertyItem label={`${l10n.property.subject}`} value={data.info.Subject} />
                <PropertyItem label={`${l10n.property.keywords}`} value={data.info.Keywords} />
                <PropertyItem label={`${l10n.property.creator}`} value={data.info.Creator} />
                <PropertyItem label={`${l10n.property.creationDate}`} value={formatDate(data.info.CreationDate)} />
                <PropertyItem label={`${l10n.property.modificationDate}`} value={formatDate(data.info.ModDate)} />
            </div>
            <div style={{ borderBottom: '1px solid rgba(0, 0, 0, .3)' }} />
            <div style={{ padding: '0 8px '}}>
                <PropertyItem label={`${l10n.property.pdfProducer}`} value={data.info.Producer} />
                <PropertyItem label={`${l10n.property.pdfVersion}`} value={data.info.PDFFormatVersion} />
                <PropertyItem label={`${l10n.property.pageCount}`} value={`${doc.numPages}`} />
            </div>
        </>
    );

    return (
        <div style={{ padding: '8px 0' }}>
            <PropertiesLoader
                doc={doc}
                render={renderData}
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '8px',
                }}
            >
                <button
                    style={{
                        backgroundColor: '#357EDD',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#FFF',
                        cursor: 'pointer',
                        padding: '8px',
                    }}
                    onClick={onToggle}
                >
                    {l10n.property.close}
                </button>
            </div>
        </div>
    );
};

export default PropertiesModal;
