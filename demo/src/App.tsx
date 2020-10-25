import React from 'react';
import { AnnotationType, Plugin, PluginOnAnnotationLayerRender, Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/default-layout/styles/index.css';

const testAnnotationRenderPlugin = (): Plugin => {
    const onRenderAnnotations = (e: PluginOnAnnotationLayerRender) => {
        // Find all `Link` annotation
        e.annotations
            .filter(annotation => annotation.annotationType === AnnotationType.Link)
            .forEach(annotation => {
                if (annotation.url) {
                    // Find the `a` element represents the link
                    [...e.container.querySelectorAll('.rpv-core-annotation-link a')].forEach(linkEle => {
                        linkEle.setAttribute('target', '_blank');
                    });
                }
            });
    };

    return {
        onAnnotationLayerRender: onRenderAnnotations,
    };
};

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            searchPlugin: {
                keyword: ['document', 'PDF'],
            },
        }
    });
    const testAnnotationRenderPluginInstance = testAnnotationRenderPlugin();

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.js">
            <div
                style={{
                    height: '750px'
                }}
            >
                <Viewer
                    fileUrl="http://localhost:8001/pdf-open-parameters.pdf"
                    plugins={[
                        defaultLayoutPluginInstance,
                        testAnnotationRenderPluginInstance,
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
