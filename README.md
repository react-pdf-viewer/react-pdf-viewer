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

## Products

You might be interested in my products:

_Products_

-   [Blur Page - A browser extension to hide sensitive information on a web page](https://blur.page)
-   [Check Browsers Support - A browser extension to check browser compatibility without leaving your tab](https://checkbrowsers.support)
-   [Fake Numbers - Generate fake and valid numbers](https://fakenumbers.io)
-   [Form Validation - The best validation library for JavaScript](https://formvalidation.io)
-   [IntersectionObserver Examples - Practical, real world examples of IntersectionObserver](https://intersectionobserver.io)
-   [React PDF Viewer - A React component to view a PDF document](https://react-pdf-viewer.dev)

_Resources_

-   [1LOC - Favorite JavaScript utilities in single line of code](https://1loc.dev)
-   [CSS Layout - A collection of popular layouts and patterns made with CSS](https://csslayout.io)
-   [HTML DOM - How to manage HTML DOM with vanilla JavaScript](https://htmldom.dev)
-   [Responsive Design Patterns - A collection of patterns to create a responsive web page](https://responsive.page)
-   [Super tiny, quick tips, tricks and best practices of front-end development](https://getfrontend.tips)
-   [this VS that - The differences between **_ and _** in the front-end development](https://thisthat.dev)
