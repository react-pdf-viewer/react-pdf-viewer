/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { OpenFile } from '@phuocng/rpv';

const downloadFile = (file: OpenFile, saveAs: string): void => {
    const blobUrl = (typeof file.data === 'string')
                    ? ''
                    : URL.createObjectURL(new Blob([file.data], { type: '' }));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl || file.name;
    link.setAttribute('download', saveAs);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
    }
};

export default downloadFile;
