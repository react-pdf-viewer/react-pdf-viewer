import { ScrollMode, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            fullScreenPlugin: {
                onEnterFullScreen: () => {
                    defaultLayoutPluginInstance.toolbarPluginInstance.scrollModePluginInstance.switchScrollMode(
                        ScrollMode.Vertical
                    );
                },
                onExitFullScreen: () => {
                    defaultLayoutPluginInstance.toolbarPluginInstance.scrollModePluginInstance.switchScrollMode(
                        ScrollMode.Page
                    );
                },
            },
        },
    });

    return (
        <div
            style={{
                height: '50rem',
                margin: '1rem auto',
                width: '64rem',
            }}
        >
            <Viewer
                initialPage={5}
                scrollMode={ScrollMode.Page}
                fileUrl={'/pdf-open-parameters.pdf'}
                plugins={[defaultLayoutPluginInstance]}
            />
        </div>
    );
};

export default IndexPage;
