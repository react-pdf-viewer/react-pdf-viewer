/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import { convertDate } from '../utils/convertDate';
import { AnnotationType } from './AnnotationType';
import type { PdfJs } from '../types/PdfJs';

export const PopupWrapper: React.FC<{
    annotation: PdfJs.Annotation;
}> = ({ annotation }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

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
            className={classNames({
                'rpv-core__annotation-popup-wrapper': true,
                'rpv-core__annotation-popup-wrapper--rtl': isRtl,
            })}
            style={{
                top: annotation.annotationType === AnnotationType.Popup ? '' : '100%',
            }}
        >
            {annotation.title && (
                <>
                    <div
                        className={classNames({
                            'rpv-core__annotation-popup-title': true,
                            'rpv-core__annotation-popup-title--ltr': !isRtl,
                            'rpv-core__annotation-popup-title--rtl': isRtl,
                        })}
                    >
                        {annotation.title}
                    </div>
                    <div className="rpv-core__annotation-popup-date">{dateStr}</div>
                </>
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
