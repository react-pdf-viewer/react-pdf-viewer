/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { LayerRenderStatus } from '../structs/LayerRenderStatus';
import styles from '../styles/textLayer.module.css';
import { type PdfJs } from '../types/PdfJs';
import { type Plugin } from '../types/Plugin';
import { PdfJsApiContext } from '../vendors/PdfJsApiContext';

export const TextLayer: React.FC<{
    containerRef: React.MutableRefObject<HTMLDivElement>;
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    onRenderTextCompleted: () => void;
}> = ({ containerRef, page, pageIndex, plugins, rotation, scale, onRenderTextCompleted }) => {
    const { pdfJsApiProvider } = React.useContext(PdfJsApiContext);
    const renderTaskRef = React.useRef<PdfJs.TextLayer>();

    const empty = (): void => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        const spans: HTMLElement[] = [].slice.call(containerEle.querySelectorAll(`.${styles.text}`));
        spans.forEach((span) => containerEle.removeChild(span));

        // Remove more elements generated by pdf.js
        const breaks: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('br[role="presentation"]'));
        breaks.forEach((br) => containerEle.removeChild(br));
    };

    useIsomorphicLayoutEffect(() => {
        const task = renderTaskRef.current;
        if (task) {
            task.cancel();
        }

        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        containerEle.removeAttribute('data-testid');
        const viewport = page.getViewport({ rotation, scale });

        // Trigger `onTextLayerRender`
        const preRenderProps = {
            ele: containerEle,
            pageIndex,
            scale,
            status: LayerRenderStatus.PreRender,
        };
        const handlePreRenderTextLayer = (plugin: Plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach((dep) => handlePreRenderTextLayer(dep));
            }
            if (plugin.onTextLayerRender) {
                plugin.onTextLayerRender(preRenderProps);
            }
        };
        plugins.forEach((plugin) => handlePreRenderTextLayer(plugin));

        page.getTextContent().then((textContent) => {
            empty();
            // Despite the fact that the `--scale-factor` is already set at the root element,
            // pdf-js still complains about setting it either on the element or higher up in the DOM
            containerEle.style.setProperty('--scale-factor', `${scale}`);

            renderTaskRef.current = new pdfJsApiProvider.TextLayer({
                container: containerEle,
                textContentSource: textContent,
                viewport: viewport,
            });
            renderTaskRef.current.render().then(
                () => {
                    containerEle.setAttribute('data-testid', `core__text-layer-${pageIndex}`);
                    // Remove unnecessary attribute generated by pdf-js
                    containerEle.removeAttribute('data-main-rotation');

                    const spans: HTMLElement[] = [].slice.call(containerEle.children);
                    spans.forEach((span) => {
                        // Distinguish with other elements created by plugins
                        if (span.getAttribute('data-text') !== 'true') {
                            span.classList.add(styles.text);
                            span.setAttribute('data-text', 'true');
                        }
                    });

                    const didRenderProps = {
                        ele: containerEle,
                        pageIndex,
                        scale,
                        status: LayerRenderStatus.DidRender,
                    };
                    const handleDidRenderTextLayer = (plugin: Plugin) => {
                        if (plugin.dependencies) {
                            plugin.dependencies.forEach((dep) => handleDidRenderTextLayer(dep));
                        }
                        if (plugin.onTextLayerRender) {
                            plugin.onTextLayerRender(didRenderProps);
                        }
                    };
                    plugins.forEach((plugin) => handleDidRenderTextLayer(plugin));
                    onRenderTextCompleted();
                },
                () => {
                    containerEle.removeAttribute('data-testid');
                    onRenderTextCompleted();
                },
            );
        });

        return () => {
            // Prevent the issue where the unit tests say that there are many text found in the React 18's Strict mode
            empty();
            renderTaskRef.current?.cancel();
        };
    }, []);

    let transform = '';
    switch (Math.abs(rotation)) {
        case 90:
            transform = 'rotate(90deg) translateY(-100%)';
            break;
        case 180:
            transform = 'rotate(180deg) translate(-100%, -100%)';
            break;
        case 270:
            transform = 'rotate(270deg) translateX(-100%)';
            break;
        default:
            transform = '';
            break;
    }

    return (
        <div
            className={styles.layer}
            ref={containerRef}
            style={{
                transform,
            }}
        />
    );
};
