/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';

interface InkProps {
    annotation: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}

const Ink: React.FC<InkProps> = ({ annotation, page, viewport }) => {
    const theme = React.useContext(ThemeContext);
    const hasPopup = annotation.hasPopup === false;
    const isRenderable = !!(annotation.hasPopup || annotation.title || annotation.contents);

    const rect = annotation.rect;
    const width = rect[2] - rect[0];
    const height = rect[3] - rect[1];

    const borderWidth = annotation.borderStyle.width;

    return (
        <Annotation annotation={annotation} hasPopup={hasPopup} ignoreBorder={true} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className={`${theme.prefixClass}-annotation ${theme.prefixClass}-annotation-ink`}
                    data-annotation-id={annotation.id}
                    onClick={props.popup.toggleOnClick}
                    onMouseEnter={props.popup.openOnHover}
                    onMouseLeave={props.popup.closeOnHover}
                >
                    {annotation.inkLists && annotation.inkLists.length && (
                        <svg
                            height={`${height}px`}
                            preserveAspectRatio='none'
                            version='1.1'
                            viewBox={`0 0 ${width} ${height}`}
                            width={`${width}px`}
                        >
                            {
                                annotation.inkLists.map((inkList, index) => (
                                    <polyline
                                        key={index}
                                        fill='none'
                                        stroke='transparent'
                                        strokeWidth={borderWidth || 1}
                                        points={inkList.map((item) => `${item.x - rect[0]},${rect[3] - item.y}`).join(' ')}
                                    />
                                ))
                            }
                        </svg>
                    )}
                    {props.slot.children}
                </div>
            )}
        </Annotation>
    );
};

export default Ink;
