import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const App = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const handleSwitchTheme = (theme: string) => {
        localStorage.setItem('theme', theme);
    };
    const theme = localStorage.getItem('theme') || '';

    return (
        <Viewer
            fileUrl='pdf-open-parameters.pdf'               
            plugins={[
                defaultLayoutPluginInstance,
            ]}
            theme={theme}
            onSwitchTheme={handleSwitchTheme}
        />
    );
};

export default App;
