/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';
import { type Slot } from '../types/Slot';
import { AnnotationBorderStyleType } from './AnnotationBorderStyleType';
import { PopupWrapper } from './PopupWrapper';
import { useTogglePopup } from './useTogglePopup';

interface RenderChildrenProps {
    popup: {
        opened: boolean;
        closeOnHover: () => void;
        openOnHover: () => void;
        toggleOnClick: () => void;
    };
    slot: Slot;
}

export const Annotation: React.FC<{
    annotation: PdfJs.Annotation;
    hasPopup: boolean;
    ignoreBorder: boolean;
    isRenderable: boolean;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    children(props: RenderChildrenProps): React.ReactElement;
}> = ({ annotation, children, ignoreBorder, hasPopup, isRenderable, page, viewport }) => {
    const { rect } = annotation;
    const { closeOnHover, opened, openOnHover, toggleOnClick } = useTogglePopup();

    const normalizeRect = (r: number[]): number[] => [
        Math.min(r[0], r[2]),
        Math.min(r[1], r[3]),
        Math.max(r[0], r[2]),
        Math.max(r[1], r[3]),
    ];

    const bound = normalizeRect([
        rect[0],
        page.view[3] + page.view[1] - rect[1],
        rect[2],
        page.view[3] + page.view[1] - rect[3],
    ]);

    let width = rect[2] - rect[0];
    let height = rect[3] - rect[1];

    let styles = {
        borderColor: '',
        borderRadius: '',
        borderStyle: '',
        borderWidth: '',
    };

    if (!ignoreBorder && annotation.borderStyle.width > 0) {
        // Border style
        switch (annotation.borderStyle.style) {
            case AnnotationBorderStyleType.Dashed:
                styles.borderStyle = 'dashed';
                break;
            case AnnotationBorderStyleType.Solid:
                styles.borderStyle = 'solid';
                break;
            case AnnotationBorderStyleType.Underline:
                styles = Object.assign(
                    {
                        borderBottomStyle: 'solid',
                    },
                    styles,
                );
                break;
            case AnnotationBorderStyleType.Beveled:
            case AnnotationBorderStyleType.Inset:
            default:
                break;
        }

        // Border with
        const borderWidth = annotation.borderStyle.width;
        styles.borderWidth = `${borderWidth}px`;
        if (annotation.borderStyle.style !== AnnotationBorderStyleType.Underline) {
            width = width - 2 * borderWidth;
            height = height - 2 * borderWidth;
        }

        // Border radius
        const { horizontalCornerRadius, verticalCornerRadius } = annotation.borderStyle;
        if (horizontalCornerRadius > 0 || verticalCornerRadius > 0) {
            styles.borderRadius = `${horizontalCornerRadius}px / ${verticalCornerRadius}px`;
        }

        // Border color
        annotation.color
            ? (styles.borderColor = `rgb(${annotation.color[0] | 0}, ${annotation.color[1] | 0}, ${
                  annotation.color[2] | 0
              })`)
            : // Reset the border width
              (styles.borderWidth = '0');
    }

    return (
        <>
            {isRenderable &&
                children({
                    popup: {
                        opened,
                        closeOnHover,
                        openOnHover,
                        toggleOnClick,
                    },
                    slot: {
                        attrs: {
                            style: Object.assign(
                                {
                                    height: `${height}px`,
                                    left: `${bound[0]}px`,
                                    top: `${bound[1]}px`,
                                    transform: `matrix(${viewport.transform.join(',')})`,
                                    transformOrigin: `-${bound[0]}px -${bound[1]}px`,
                                    width: `${width}px`,
                                },
                                styles,
                            ),
                        },
                        children: <>{hasPopup && opened && <PopupWrapper annotation={annotation} />}</>,
                    },
                })}
        </>
    );
};
