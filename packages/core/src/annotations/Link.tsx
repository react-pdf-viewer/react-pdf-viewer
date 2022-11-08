/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';
import type { PdfJs } from '../types/PdfJs';
import type { DestinationOffsetFromViewport } from '../types/PluginFunctions';
import { getDestination } from '../utils/managePages';
import { sanitizeUrl } from '../utils/sanitizeUrl';
import { Annotation } from './Annotation';

export const Link: React.FC<{
    annotation: PdfJs.Annotation;
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(
        pageIndex: number,
        bottomOffset: number | DestinationOffsetFromViewport,
        leftOffset: number | DestinationOffsetFromViewport,
        scaleTo?: number | SpecialZoomLevel
    ): void;
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
