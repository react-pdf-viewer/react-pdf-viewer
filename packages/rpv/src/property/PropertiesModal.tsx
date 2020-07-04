/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import PrimaryButton from '../components/PrimaryButton';
import Separator from '../components/Separator';
import LocalizationContext from '../localization/LocalizationContext';
import ThemeContext from '../theme/ThemeContext';
import convertDate from '../utils/convertDate';
import getFileName from '../utils/fileName';
import getFileSize from '../utils/fileSize';
import PdfJs from '../vendors/PdfJs';
import PropertiesData from './PropertiesData';
import PropertiesLoader from './PropertiesLoader';
import './propertiesModal.less';
import PropertyItem from './PropertyItem';

interface PropertiesModalProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    onToggle(): void;
}

const PropertiesModal: React.FC<PropertiesModalProps> = ({ doc, fileName, onToggle }) => {
    const l10n = useContext(LocalizationContext);
    const theme = useContext(ThemeContext);

    const formatDate = (input: string): string => {
        const date = convertDate(input);
        return date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : '';
    };

    const renderData = (data: PropertiesData): React.ReactElement => (
        <>
            <div className={`${theme.prefixClass}-properties-modal-group`}>
                <PropertyItem label={`${l10n.property.fileName}`} value={data.fileName || getFileName(fileName)} />
                <PropertyItem label={`${l10n.property.fileSize}`} value={getFileSize(data.length)} />
            </div>
            <Separator />
            <div className={`${theme.prefixClass}-properties-modal-group`}>
                <PropertyItem label={`${l10n.property.title}`} value={data.info.Title} />
                <PropertyItem label={`${l10n.property.author}`} value={data.info.Author} />
                <PropertyItem label={`${l10n.property.subject}`} value={data.info.Subject} />
                <PropertyItem label={`${l10n.property.keywords}`} value={data.info.Keywords} />
                <PropertyItem label={`${l10n.property.creator}`} value={data.info.Creator} />
                <PropertyItem label={`${l10n.property.creationDate}`} value={formatDate(data.info.CreationDate)} />
                <PropertyItem label={`${l10n.property.modificationDate}`} value={formatDate(data.info.ModDate)} />
            </div>
            <Separator />
            <div className={`${theme.prefixClass}-properties-modal-group`}>
                <PropertyItem label={`${l10n.property.pdfProducer}`} value={data.info.Producer} />
                <PropertyItem label={`${l10n.property.pdfVersion}`} value={data.info.PDFFormatVersion} />
                <PropertyItem label={`${l10n.property.pageCount}`} value={`${doc.numPages}`} />
            </div>
        </>
    );

    return (
        <div className={`${theme.prefixClass}-properties-modal`}>
            <PropertiesLoader
                doc={doc}
                render={renderData}
            />
            <div className={`${theme.prefixClass}-properties-modal-footer`}>
                <PrimaryButton onClick={onToggle}>
                    {l10n.property.close}
                </PrimaryButton>
            </div>
        </div>
    );
};

export default PropertiesModal;
