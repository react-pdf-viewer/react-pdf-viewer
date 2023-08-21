import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin, Trigger, type RenderHighlightsProps } from '@react-pdf-viewer/highlight';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const areas = [
        {
            pageIndex: 3,
            height: 1.55401,
            width: 28.1674,
            left: 27.5399,
            top: 15.0772,
        },
        {
            pageIndex: 3,
            height: 1.32637,
            width: 37.477,
            left: 55.7062,
            top: 15.2715,
        },
        {
            pageIndex: 3,
            height: 1.55401,
            width: 28.7437,
            left: 16.3638,
            top: 16.6616,
        },
    ];

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
                            props.getCssProperties(area, props.rotation),
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
        <div className="demo">
            <Viewer
                fileUrl="/pdf-open-parameters.pdf"
                plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
            />
        </div>
    );
};

export default IndexPage;
