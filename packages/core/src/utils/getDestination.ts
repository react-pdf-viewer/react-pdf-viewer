/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import SpecialZoomLevel from '../SpecialZoomLevel';
import PdfJs from '../vendors/PdfJs';

interface JumpToDestination {
    bottomOffset: number;
    pageIndex: number;
    scaleTo: number | SpecialZoomLevel;
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
        case 'FitB':
            return {
                bottomOffset: 0,
                pageIndex: pageIndex - 1,
                scaleTo: SpecialZoomLevel.PageFit,
            };
        case 'FitH':
        case 'FitBH':
            return {
                bottomOffset: destArray[2],
                pageIndex: pageIndex - 1,
                scaleTo: SpecialZoomLevel.PageWidth,
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
    return new Promise<JumpToDestination>((res) => {
        new Promise<PdfJs.OutlineDestination>((resolve) => {
            if (typeof dest === 'string') {
                doc.getDestination(dest).then((destArray) => {
                    resolve(destArray);
                });
            } else {
                resolve(dest);
            }
        })
            .then((destArray) =>
                'object' === typeof destArray[0]
                    ? doc.getPageIndex(destArray[0]).then((pageIndex) => Promise.resolve({ pageIndex, destArray }))
                    : Promise.resolve({
                          pageIndex: destArray[0],
                          destArray,
                      })
            )
            .then(({ pageIndex, destArray }) => {
                const target = parse(pageIndex, destArray);
                res(target);
            });
    });
};

export default getDestination;
