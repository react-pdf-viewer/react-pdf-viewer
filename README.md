# React PDF viewer

A React component to view a PDF document. It's written in TypeScript, and powered by React hooks completely.

![React PDF viewer](https://raw.githubusercontent.com/react-pdf-viewer/react-pdf-viewer/master/assets/screenshot.png)

```javascript
// Core viewer
import { Viewer } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Create new plugin instance
const defaultLayoutPluginInstance = defaultLayoutPlugin();

<Viewer
    fileUrl='/assets/pdf-open-parameters.pdf'
    plugins={[
        // Register plugins
        defaultLayoutPluginInstance,
        ...
    ]}
/>
```

## Features

**Basic features**

-   [x] Support password protected document
-   [x] Zooming: Support custom levels such as actual size, page fit, and page width
-   [x] Navigation between pages
-   [x] Can go to the first and last pages quickly
-   [x] Search for text
-   [x] Preview page thumbnails
-   [x] View and navigate the table of contents
-   [x] List and download attachments
-   [x] Rotating
-   [x] Text selection and hand tool modes
-   [x] Different scrolling modes
-   [x] Full screen mode
-   [x] Can open a file from local. Users can drag and drop a local file to view it
-   [x] Download file
-   [x] View the document properties
-   [x] Support SSR
-   [x] Print
-   [x] Theming
-   [x] Dark mode
-   [x] Accessibility

**Customization**

-   [x] The toolbar can be customized easily
-   [x] All text items can be localized in another language

## License

You have to purchase a Commercial License at the [official website](https://react-pdf-viewer.dev).

## About

This project is developed by _Nguyen Huu Phuoc_. I love building products and sharing knowledge.

Be my friend on

-   [Twitter](https://twitter.com/nghuuphuoc)
-   [dev.to](https://dev.to/phuocng)
-   [Github](https://github.com/phuoc-ng)
