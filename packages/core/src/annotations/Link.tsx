/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContext from '../theme/ThemeContext';
import getDestination from '../utils/getDestination';
import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';

interface LinkProps {
    annotation: PdfJs.Annotation;
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const Link: React.FC<LinkProps> = ({ annotation, doc, page, viewport, onExecuteNamedAction, onJumpToDest }) => {
    const theme = useContext(ThemeContext);
    const link = (e: React.MouseEvent): void => {
        e.preventDefault();
        annotation.action
            ? onExecuteNamedAction(annotation.action)
            : getDestination(doc, annotation.dest).then((target) => {
                const { pageIndex, bottomOffset, scaleTo } = target;
                onJumpToDest(pageIndex + 1, bottomOffset, 0, scaleTo);
            });
    };

    const isRenderable = !!(annotation.url || annotation.dest || annotation.action);
    const attrs = annotation.url
        ? {
            href: annotation.url,
            rel: 'noopener noreferrer nofollow',
            target: annotation.newWindow ? '_blank' : '',
            title: annotation.url,
        }
        : {
            href: '',
            onClick: link,
        };

    return (
        <Annotation annotation={annotation} hasPopup={false} ignoreBorder={false} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className={`${theme.prefixClass}-annotation ${theme.prefixClass}-annotation-link`}
                    data-annotation-id={annotation.id}
                >
                    <a
                        {...attrs}
                    />
                </div>
            )}
        </Annotation>
    );
};

export default Link;
