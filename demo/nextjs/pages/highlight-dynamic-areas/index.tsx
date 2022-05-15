import { Button, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { HighlightArea, RenderHighlightsProps } from '@react-pdf-viewer/highlight';
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
import * as React from 'react';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const firstAreas: HighlightArea[] = [
        {
            pageIndex: 3,
            height: 1.55401,
            width: 28.1674,
            left: 27.5399,
            top: 15.0772,
        },
        {
            pageIndex: 3,
            height: 1.55401,
            width: 28.7437,
            left: 16.3638,
            top: 16.6616,
        },
    ];

    const secondAreas: HighlightArea[] = [
        {
            pageIndex: 3,
            height: 1.32637,
            width: 37.477,
            left: 55.7062,
            top: 15.2715,
        },
    ];

    const [areas, setAreas] = React.useState<HighlightArea[]>([]);

    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
            {areas
                .filter((area) => area.pageIndex === props.pageIndex)
                .map((area, idx) => (
                    <div
                        key={idx}
                        className="highlight-area"
                        style={Object.assign(
                            {},
                            {
                                background: 'yellow',
                                opacity: 0.4,
                            },
                            props.getCssProperties(area, props.rotation)
                        )}
                    />
                ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlights,
        trigger: Trigger.None,
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                margin: '5rem auto',
                width: '50rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    padding: '0.5rem 0',
                }}
            >
                <div style={{ marginRight: '0.5rem' }}>
                    <Button testId="first-areas" onClick={() => setAreas(firstAreas)}>
                        Load first set areas
                    </Button>
                </div>
                <Button testId="second-areas" onClick={() => setAreas(secondAreas)}>
                    Load second set areas
                </Button>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
                />
            </div>
        </div>
    );
};

export default IndexPage;
