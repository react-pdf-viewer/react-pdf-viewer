/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import {
    LocalizationContext,
    Spinner,
    TextDirection,
    ThemeContext,
    classNames,
    type LocalizationMap,
    type PdfJs,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { AttachmentList } from './AttachmentList';
import { type FileItem } from './types/FileItem';

interface AttachmentState {
    files: FileItem[];
    isLoaded: boolean;
}

export const AttachmentLoader: React.FC<{
    doc: PdfJs.PdfDocument;
}> = ({ doc }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);

    const isRtl = direction === TextDirection.RightToLeft;
    const noAttachmentLabel =
        l10n && l10n.attachment
            ? ((l10n.attachment as LocalizationMap).noAttachment as string)
            : 'There is no attachment';

    const [attachments, setAttachments] = React.useState<AttachmentState>({
        files: [],
        isLoaded: false,
    });

    React.useEffect(() => {
        doc.getAttachments().then((response) => {
            const files = response
                ? Object.keys(response).map((file) => {
                      return {
                          data: response[file].content,
                          fileName: response[file].filename,
                      };
                  })
                : [];
            setAttachments({
                files,
                isLoaded: true,
            });
        });
    }, [doc]);

    return !attachments.isLoaded ? (
        <Spinner />
    ) : attachments.files.length === 0 ? (
        <div
            data-testid="attachment__empty"
            className={classNames({
                'rpv-attachment__empty': true,
                'rpv-attachment__empty--rtl': isRtl,
            })}
        >
            {noAttachmentLabel}
        </div>
    ) : (
        <AttachmentList files={attachments.files} />
    );
};
