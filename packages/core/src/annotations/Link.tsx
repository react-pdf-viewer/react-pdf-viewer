/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { type Destination } from '../types/Destination';
import { type PdfJs } from '../types/PdfJs';
import { getDestination } from '../utils/managePages';
import { sanitizeUrl } from '../utils/sanitizeUrl';
import { Annotation } from './Annotation';

export const Link: React.FC<{
    annotation: PdfJs.Annotation;
    annotationContainerRef: React.MutableRefObject<HTMLElement>;
    doc: PdfJs.PdfDocument;
    outlines: PdfJs.Outline[];
    page: PdfJs.Page;
    pageIndex: number;
    scale: number;
    viewport: PdfJs.ViewPort;
    onExecuteNamedAction(action: string): void;
    onJumpFromLinkAnnotation(destination: Destination): void;
    onJumpToDest(destination: Destination): void;
}> = ({
    annotation,
    annotationContainerRef,
    doc,
    outlines,
    page,
    pageIndex,
    scale,
    viewport,
    onExecuteNamedAction,
    onJumpFromLinkAnnotation,
    onJumpToDest,
}) => {
    const elementRef = React.useRef<HTMLAnchorElement>();

    // Determine the corresponding outline that has the same destination
    const title =
        outlines && outlines.length && annotation.dest && typeof annotation.dest === 'string'
            ? outlines.find((item) => item.dest === annotation.dest)?.title
            : '';

    const link = (e: React.MouseEvent): void => {
        e.preventDefault();
        annotation.action
            ? onExecuteNamedAction(annotation.action)
            : getDestination(doc, annotation.dest).then((target) => {
                  const element = elementRef.current;
                  const annotationContainer = annotationContainerRef.current;
                  if (element && annotationContainer) {
                      const linkRect = element.getBoundingClientRect();

                      // By default, we can't set the full size for the annotation layer
                      // Otherwise, it's not possible to select the text in the pages
                      // To calculate the bounding rectangle of annotation layer, we have to set the height and width styles
                      annotationContainer.style.setProperty('height', '100%');
                      annotationContainer.style.setProperty('width', '100%');
                      const annotationLayerRect = annotationContainer.getBoundingClientRect();

                      // Then remove them
                      annotationContainer.style.removeProperty('height');
                      annotationContainer.style.removeProperty('width');

                      const leftOffset = (linkRect.left - annotationLayerRect.left) / scale;
                      const bottomOffset = (annotationLayerRect.bottom - linkRect.bottom + linkRect.height) / scale;
                      onJumpFromLinkAnnotation({
                          bottomOffset,
                          label: title,
                          leftOffset,
                          pageIndex,
                      });
                  }

                  onJumpToDest(target);
              });
    };

    let isRenderable = !!(annotation.url || annotation.dest || annotation.action || annotation.unsafeUrl);

    // Many applications such as macOS Preview, Chrome, pdf.js don't enable links that have the `unsafeUrl` attribute
    // However, it is requested by our customers
    let attrs = {};
    if (annotation.url || annotation.unsafeUrl) {
        const targetUrl = sanitizeUrl(annotation.url || annotation.unsafeUrl, '');
        if (targetUrl) {
            attrs = {
                'data-target': 'external',
                href: targetUrl,
                rel: 'noopener noreferrer nofollow',
                target: annotation.newWindow ? '_blank' : '',
                title: targetUrl,
            };
        } else {
            isRenderable = false;
        }
    } else {
        attrs = {
            href: '',
            'data-annotation-link': annotation.id,
            onClick: link,
        };
    }

    if (title) {
        attrs = Object.assign({}, attrs, {
            title,
            'aria-label': title,
        });
    }

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
                    <a ref={elementRef} {...attrs} />
                </div>
            )}
        </Annotation>
    );
};
