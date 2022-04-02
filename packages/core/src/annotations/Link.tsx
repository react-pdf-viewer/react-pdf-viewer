/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import { getDestination } from '../utils/managePages';
import { Annotation } from './Annotation';
import type { PdfJs } from '../types/PdfJs';

export const Link: React.FC<{
    annotation: PdfJs.Annotation;
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
}> = ({ annotation, doc, page, viewport, onExecuteNamedAction, onJumpToDest }) => {
    const link = (e: React.MouseEvent): void => {
        e.preventDefault();
        annotation.action
            ? onExecuteNamedAction(annotation.action)
            : getDestination(doc, annotation.dest).then((target) => {
                  const { pageIndex, bottomOffset, leftOffset, scaleTo } = target;
                  onJumpToDest(pageIndex, bottomOffset, leftOffset, scaleTo);
              });
    };

    const isRenderable = !!(annotation.url || annotation.dest || annotation.action || annotation.unsafeUrl);
    const externalUrl = annotation.url || annotation.unsafeUrl;
    const attrs = externalUrl
        ? {
              'data-target': 'external',
              href: externalUrl,
              rel: 'noopener noreferrer nofollow',
              target: annotation.newWindow ? '_blank' : '',
              title: externalUrl,
          }
        : {
              href: '',
              'data-annotation-link-dest': annotation.dest,
              onClick: link,
          };

    return (
        <Annotation
            annotation={annotation}
            hasPopup={false}
            ignoreBorder={false}
            isRenderable={isRenderable}
            page={page}
            viewport={viewport}
        >
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    className="rpv-core__annotation rpv-core__annotation--link"
                    data-annotation-id={annotation.id}
                    data-testid={`core__annotation--link-${annotation.id}`}
                >
                    <a {...attrs} />
                </div>
            )}
        </Annotation>
    );
};
