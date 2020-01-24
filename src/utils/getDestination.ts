/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import PdfJs from '../PdfJs';
import { SpecialLevel } from '../zoom/zoomingLevel';

interface JumpToDestination {
    bottomOffset: number;
    pageIndex: number;
    scaleTo: number | SpecialLevel;
}

const parse = (pageIndex: number, destArray: PdfJs.OutlineDestination): JumpToDestination => {
    let bottomOffset;
    let scale;
    switch (destArray[1].name) {
        case 'XYZ':
            bottomOffset = destArray[3];
            scale = destArray[4];
            return {
                bottomOffset,
                pageIndex: pageIndex - 1,
                scaleTo: scale,
            };
        case 'Fit':
            return {
                bottomOffset: 0,
                pageIndex: pageIndex - 1,
                scaleTo: SpecialLevel.PageFit,
            };
        default:
            return {
                bottomOffset: 0,
                pageIndex: pageIndex - 1,
                scaleTo: 1,
            };
    }
};

const getDestination = (doc: PdfJs.PdfDocument, dest: PdfJs.OutlineDestinationType): Promise<JumpToDestination> => {
    return new Promise<JumpToDestination>((res, _) => {
        new Promise<PdfJs.OutlineDestination>((resolve, __) => {
            if (typeof dest === 'string') {
                doc.getDestination(dest).then((destArray) => {
                    resolve(destArray);
                });
            } else {
                resolve(dest);
            }
        }).then((destArray) => {
            doc.getPageIndex(destArray[0]).then((pageIndex) => {
                const target = parse(pageIndex, destArray);
                res(target);
            });
        });
    });
};

export default getDestination;
