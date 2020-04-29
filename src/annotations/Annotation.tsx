/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import useToggle, { ToggleStatus } from '../hooks/useToggle';
import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import './annotation.less';
import PopupWrapper from './PopupWrapper';

export interface RenderChildrenProps {
    isPopupOpened: boolean;
    closePopupWhenHover: () => void;
    openPopupWhenHover: () => void;
    togglePopupWhenClick: () => void;
}

interface AnnotationProps {
    annotation: PdfJs.Annotation;
    hasPopup: boolean;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    children(props: RenderChildrenProps): React.ReactElement;
}

enum TogglePopupBy {
    Click,
    Hover,
}

const Annotation: React.FC<AnnotationProps> = ({ annotation, children, hasPopup, page, viewport }) => {
    const theme = React.useContext(ThemeContent);
    const { rect } = annotation;
    const { opened, toggle } = useToggle();
    const [togglePopupBy, setTooglePopupBy] = React.useState(TogglePopupBy.Hover);

    const togglePopupWhenClick = () => {
        switch (togglePopupBy) {
            case TogglePopupBy.Click:
                opened && setTooglePopupBy(TogglePopupBy.Hover);
                toggle(ToggleStatus.Toggle);
                break;
            case TogglePopupBy.Hover:
                setTooglePopupBy(TogglePopupBy.Click);
                toggle(ToggleStatus.Open);
                break;
        }
    };

    const openPopupWhenHover = () => {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Open);
    };

    const closePopupWhenHover = () => {
        togglePopupBy === TogglePopupBy.Hover && toggle(ToggleStatus.Close);
    };

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
        <div
            className={`${theme.prefixClass}-annotation`}
            style={{
                height: `${height}px`,
                left: `${bound[0]}px`,
                top: `${bound[1]}px`,
                transform: `matrix(${viewport.transform.join(',')})`,
                transformOrigin: `-${bound[0]}px -${bound[1]}px`,
                width: `${width}px`,
            }}
            data-annotation-id={annotation.id}
        >
            {
                children({
                    isPopupOpened: opened,
                    closePopupWhenHover,
                    openPopupWhenHover,
                    togglePopupWhenClick,
                })
            }
            {hasPopup && opened && (
                <PopupWrapper
                    annotation={annotation}
                />
            )}
        </div>
    );
};

export default Annotation;
