This folder demonstrates how to bundle [React PDF viewer](https://react-pdf-viewer.dev) with [Webpack v4](https://webpack.js.org)

## Install

-   Install the dependencies

```console
$ npm install
```

-   Build

```console
$ npm run build
```

-   Run locally

```console
$ npm run dev
```

Visit http://localhost:8001/. You can change the port `8001` in the `devServer.port` section of the webpack setting file:

```js
// webpack.config.js

module.exports = {
    ...
    devServer: {
        port: 8001,
    },
};
```

## Spotlights

[App.jsx](src/App.jsx):

```js
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const defaultLayoutPluginInstance = defaultLayoutPlugin();

return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.js">
        <div style={{ height: '750px' }}>
            <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[defaultLayoutPluginInstance]} />
        </div>
    </Worker>
);
```
