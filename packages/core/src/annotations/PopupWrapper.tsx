/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import convertDate from '../utils/convertDate';
import PdfJs from '../vendors/PdfJs';
import AnnotationType from './AnnotationType';

interface PopupWrapperProps {
    annotation: PdfJs.Annotation;
}

const PopupWrapper: React.FC<PopupWrapperProps> = ({ annotation }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    let dateStr = '';
    if (annotation.modificationDate) {
        const date = convertDate(annotation.modificationDate);
        dateStr = date ? `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}` : '';
    }

    React.useLayoutEffect(() => {
        // Increase the z-index of annotation element
        // so it won't be displayed under the previous or next page
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        // Query the annotation element
        const annotationEle = document.querySelector(`[data-annotation-id="${annotation.id}"]`);
        if (!annotationEle) {
            return;
        }

        const ele = annotationEle as HTMLElement;
        ele.style.zIndex += 1;

        return () => {
            // Reset the `z-index` when the popup is closed
            ele.style.zIndex = `${parseInt(ele.style.zIndex, 10) - 1}`;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="rpv-core__annotation-popup-wrapper"
            style={{
                top: annotation.annotationType === AnnotationType.Popup ? '' : '100%',
            }}
        >
            {annotation.title && (
                <div className="rpv-core__annotation-popup-header">
                    <div className="rpv-core__annotation-popup-title">{annotation.title}</div>
                    <span className="rpv-core__annotation-popup-date">{dateStr}</span>
                </div>
            )}
            {annotation.contents && (
                <div className="rpv-core__annotation-popup-content">
                    {annotation.contents.split('\n').map((item, index) => (
                        <React.Fragment key={index}>
                            {item}
                            <br />
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopupWrapper;
