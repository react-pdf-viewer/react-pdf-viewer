/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Slot from '../layouts/Slot';
import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import './annotation.less';
import PopupWrapper from './PopupWrapper';
import useTogglePopup from './useTogglePopup';

interface RenderChildrenProps {
    popup: {
        opened: boolean;
        closeOnHover: () => void;
        openOnHover: () => void;
        toggleOnClick: () => void;
    };
    slot: Slot;
}

interface AnnotationProps {
    annotation: PdfJs.Annotation;
    hasPopup: boolean;
    isRenderable: boolean;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    children(props: RenderChildrenProps): React.ReactElement;
}

const Annotation: React.FC<AnnotationProps> = ({ annotation, children, hasPopup, isRenderable, page, viewport }) => {
    const theme = React.useContext(ThemeContent);
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

    const width = rect[2] - rect[0];
    const height = rect[3] - rect[1];

    return (
        <>
        {
            isRenderable &&
            children({
                popup: {
                    opened,
                    closeOnHover,
                    openOnHover,
                    toggleOnClick,
                },
                slot: {
                    attrs: {
                        className: `${theme.prefixClass}-annotation`,
                        style: {
                            height: `${height}px`,
                            left: `${bound[0]}px`,
                            top: `${bound[1]}px`,
                            transform: `matrix(${viewport.transform.join(',')})`,
                            transformOrigin: `-${bound[0]}px -${bound[1]}px`,
                            width: `${width}px`,
                        },
                    },
                    children: (
                        <>
                        {hasPopup && opened && (
                            <PopupWrapper
                                annotation={annotation}
                            />
                        )}
                        </>
                    ),
                }
            })
        }
        </>
    );
};

export default Annotation;
