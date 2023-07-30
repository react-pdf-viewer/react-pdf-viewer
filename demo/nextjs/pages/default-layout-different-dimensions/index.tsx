import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div
            style={{
                display: 'flex',
                height: '50rem',
                width: '64rem',
            }}
        >
            <Viewer defaultScale={0.5} fileUrl="/different-dimensions.pdf" plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

export default IndexPage;
