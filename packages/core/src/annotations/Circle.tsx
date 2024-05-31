/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';
import { Annotation } from './Annotation';
import { getContents } from './getContents';
import { getTitle } from './getTitle';

export const Circle: React.FC<{
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}> = ({ annotation, page, viewport }) => {
    const hasPopup = annotation.hasPopup === false;
    const title = getTitle(annotation);
    const contents = getContents(annotation);
    const isRenderable = !!(annotation.hasPopup || title || contents);

    const rect = annotation.rect;
    const width = rect[2] - rect[0];
    const height = rect[3] - rect[1];

    const borderWidth = annotation.borderStyle.width;

    return (
        <Annotation
            annotation={annotation}
            hasPopup={hasPopup}
            ignoreBorder={true}
            isRenderable={isRenderable}
            page={page}
            viewport={viewport}
        >
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className="rpv-core__annotation rpv-core__annotation--circle"
                    data-annotation-id={annotation.id}
                    onClick={props.popup.toggleOnClick}
                    onMouseEnter={props.popup.openOnHover}
                    onMouseLeave={props.popup.closeOnHover}
                >
                    <svg
                        height={`${height}px`}
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox={`0 0 ${width} ${height}`}
                        width={`${width}px`}
                    >
                        <circle
                            cy={height / 2}
                            fill="none"
                            rx={width / 2 - borderWidth / 2}
                            ry={height / 2 - borderWidth / 2}
                            stroke="transparent"
                            strokeWidth={borderWidth || 1}
                        />
                    </svg>
                    {props.slot.children}
                </div>
            )}
        </Annotation>
    );
};
