# CHANGELOG

## v2.2.0 (not released yet)

**New features**
- Support loading PDF from a protected resource with new `authorization` option.

~~~ javascript
import { Viewer } from '@react-pdf-viewer/core';

<Viewer
    fileUrl={...}
    authorization='Bearer ...'
/>
~~~

If you want to use another authorization servers or send more additional authentication headers, then use the new `httpHeaders` option, for example:

~~~ javascript
import { Viewer } from '@react-pdf-viewer/core';

<Viewer
    fileUrl={...}
    httpHeaders={
        Authorization: '...',
    }
/>
~~~

- It's possible to customize the search control with the new `Search` component:

~~~ javascript
import { RenderSearchProps, Search } from '@react-pdf-viewer/search';

<Search>
{
    (renderSearchProps: RenderSearchProps) => (
        // Your custom search control
    )
}
</Search>
~~~ 

The parameter `renderSearchProps` provides the properties and methods to build up a custom search control:

| Property              | Type          | Description                                                                           |
|-----------------------|---------------|---------------------------------------------------------------------------------------|
| `clearKeyword`        | `Function`    | Clear the keyword                                                                     |
| `changeMatchCase`     | `Function`    | The result has to match case with the keyword                                         |
| `changeWholeWords`    | `Function`    | The result has to match the whole keyword                                             |
| `currentMatch`        | `number`      | The index of current match                                                            |
| `jumpToNextMatch`     | `Function`    | Jump to the next match                                                                |
| `jumpToPreviousMatch` | `Function`    | Jump to the previous match                                                            |
| `keyword`             | `string`      | The current keyword                                                                   |
| `matchCase`           | `boolean`     | `true` if the result matches case with the keyword                                    |
| `wholeWords`          | `boolean`     | `true` if the result matches the whole keyword                                        |
| `search`              | `Function`    | Perform the search with current `keyword` and `matchCase`, `wholeWords` conditions    |
| `setKeyword`          | `Function`    | Set the current keyword                                                               |

**Bug fixes**
- The print plugin doesn't work with default-layout plugin
- In some cases, there is an extra blank page when printing

## v2.1.0

**New features**
- Add `onAnnotationLayerRender` hook for plugin. We can perform custom action after annotations are rendered.
The following sample code creates a plugin that finds all annotation links, and add the `target="_blank"` attribute to the links:

~~~ javascript
import { AnnotationType, Plugin, PluginOnAnnotationLayerRender } from '@react-pdf-viewer/core';

const customPlugin = (): Plugin => {
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
~~~

- The `seach` plugin allows to set multiple keywords to be highlighted initially

~~~ javascript
// Use the search plugin
import { searchPlugin } from '@react-pdf-viewer/search';
const searchPluginInstance = searchPlugin({
    keyword: ['document', 'PDF'],
});

// Use with default-layout plugin
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
        searchPlugin: {
            keyword: ['document', 'PDF'],
        },
    },
});
~~~

**Improvements**
- Optimize the `seach` plugin that doesn't perform unhighligting and highlighting many times after texts are rendered

**Bug fixes**
- Clicking _Previous match_ or _Next match_ button throws an error if the keyword is empty
- Fix the incorrect path of styles

**Upgrade from 2.0.1 to 2.1.0**

We have to update the path of styles which are placed in the `lib` directory. For example:

~~~ javascript
// Old version
import '@react-pdf-viewer/core/styles/index.css';

// New version
import '@react-pdf-viewer/core/lib/styles/index.css';
~~~

## v2.0.1

This version rewrites the entire viewer with the plugin architecture. The main viewer component `Viewer` is very lightweight,
and everything else is powered by plugins.

The basic setup looks like following:

~~~ javascript
// Import plugin
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

// Import styles
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

// Create the plugin instance
const toolbarPluginInstance = toolbarPlugin(...);

// Register plugins
<Viewer
    plugins={[
        // Array of plugins
        toolbarPlugin,
        ...
    ]}
/>
~~~

**New features**

- `Viewer` supports to use a custom loader instead of the default `<Spinner>`:

~~~ javascript
import { ProgressBar, Viewer } from '@react-pdf-viewer/core';

<Viewer
    renderLoader={(percentages: number) => (
        // You can use your own progress bar component
        <div style={{ width: '240px' }}>
            <ProgressBar progress={Math.round(percentages)} />
        </div>
    )}
/>
~~~

- Customizable name of download file with the [get-file](https://react-pdf-viewer.dev/plugins/get-file) plugin:

~~~ javascript
const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: (file: OpenFile) => {
        // `file.name` is the URL of opened file
        const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
        return `a-copy-of-${fileName}`;
    },
});
~~~

- New [Locale Switcher](https://react-pdf-viewer.dev/plugins/locale-switcher) plugin for switching between different locales
- Provide the ability of setting the scroll mode via the [Scroll Mode](https://react-pdf-viewer.dev/plugins/scroll-mode) plugin. 

**Bug fixes**
- The `onPageChange` could be invoked several times when clicking an outline item

**Breaking changes**

- The `keyword` option is removed. Use the `keyword` option provided by the [search plugin](https://react-pdf-viewer.dev/plugins/search).
- The `layout` option is removed
- The `render` option is removed
- The `selectionMode` option is removed. Use the `selectionMode` option provided by the [selection-mode plugin](https://react-pdf-viewer.dev/plugins/selection-mode).
- The `onTextLayerRender` option is removed. Instead, use the `onTextLayerRender` option in your plugin.

**Upgrade from 1.7.0 to 2.0.0**

*Uninstall the old packages:*

~~~ console
npm uninstall pdfjs-dist
npm uninstall @phuocng/react-pdf-viewer
~~~

*Install the new packages:*

~~~ console
npm install pdfjs-dist@2.5.207
npm install @react-pdf-viewer/core@2.0.1
~~~

*Replace the old \`Worker\` with new one:*

~~~ javascript
// Remove the old Worker
import { Worker } from '@phuocng/react-pdf-viewer';

// Use the new Worker
import { Worker } from '@react-pdf-viewer/core';
~~~

*Use the new `Viewer`:*

- First, you might need to install the [Default Layout](https://react-pdf-viewer.dev/plugins/default-layout) plugin:

~~~ console
npm install @react-pdf-viewer/default-layout@2.0.0
~~~

- Replace the old `Viewer` with new one:

~~~ javascript
// Old Viewer
import Viewer from '@phuocng/react-pdf-viewer';

// New Viewer
import { Viewer } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Create new plugin instance
const defaultLayoutPluginInstance = defaultLayoutPlugin();

// Your render function
<Viewer
    fileUrl='/path/to/document.pdf'
    plugins={[
        // Register plugins
        defaultLayoutPluginInstance,
        ...
    ]}
/>
~~~

## v1.7.0

**New features**

- Add `onPageChange` callback that is invoked when user changes page:

~~~ javascript
import Viewer, { PageChangeEvent } from '@phuocng/react-pdf-viewer';

const handlePageChange = (e: PageChangeEvent) => {
    console.log(`Changed to page: ${e.currentPage}`)
};

<Viewer
    fileUrl='/path/to/document.pdf'
    onPageChange={handlePageChange}
/>
~~~

- Add `onCanvasLayerRender` event that is invoked when the canvas layer is rendered completely.

~~~ javascript
import Viewer, { CanvasLayerRenderEvent } from '@phuocng/react-pdf-viewer';

const onCanvasLayerRender = (e: CanvasLayerRenderEvent) => {
    // `e.ele` is the canvas element
    const canvas = e.ele;
    // Do something with the canvas element
};

<Viewer
    fileUrl='/path/to/document.pdf'
    onCanvasLayerRender={onCanvasLayerRender}
/>
~~~

- Add `onTextLayerRender` event that is invoked when the text layer is ready.

~~~ javascript
import Viewer, { TextLayerRenderEvent } from '@phuocng/react-pdf-viewer';

const onTextLayerRender = (e: TextLayerRenderEvent) => {
    // For example, we can find all text elements that look like a link, 
    // and replace it with `a` elements
};

<Viewer
    fileUrl='/path/to/document.pdf'
    onTextLayerRender={onTextLayerRender}
/>
~~~

- Support non-latin characters via the `characterMap` option

~~~ javascript
import Viewer, { CharacterMap } from '@phuocng/react-pdf-viewer';

const characterMap: CharacterMap = {
    isCompressed: true,
    url: 'https://unpkg.com/pdfjs-dist@2.4.456/cmaps/',
};

<Viewer
    characterMap={characterMap}
    fileUrl='/path/to/document.pdf'
/>
~~~

**Bug fixes**

- The viewer doesn't jump to the destination or searching result exactly

**Breaking changes**

The parameters of `onDocumentLoad` and `onZoom` are changed as following:

| v1.6.0                | v1.7.0                    |
|-----------------------|---------------------------|
| `onDocumentLoad(doc)` | `onDocumentLoad({ doc })` |
| `onZoom(doc, scale)`  | `onZoom({ doc, scale })`  |

## v1.6.0

**New features**

- The annotation layer is rewritten. Support the following type of annotations:
    * Caret
    * Circle
    * File attachment
    * Free text
    * Highlight
    * Ink
    * Line
    * Link
    * Polygon
    * Polyline
    * Popup
    * Square
    * Squiggly
    * Stamp
    * StrikeOut
    * Text
    * Underline

- The link annotation supports named actions which allow to jump to the first, last, next or previous pages
- Customize error renderer.

~~~ javascript
const renderError = (error: LoadError) => {
    let message = '';
    switch (error.name) {
        case 'InvalidPDFException':
            message = 'The document is invalid or corrupted';
            break;
        case 'MissingPDFException':
            message = 'The document is missing';
            break;
        case 'UnexpectedResponseException':
            message = 'Unexpected server response';
            break;
        default:
            message = 'Cannot load the document';
            break;
    }

    return (<div>{message}</div>);
};

<Viewer
    fileUrl={fileUrl}
    renderError={renderError}
/>
~~~

**Improvements**
- Allow to control the `fileUrl` option
- Bookmarks support external links
- Support external links

**Bug fixes**
- The canvas layer is blurry
- The tooltip, popover positions are not correct in some cases
- The drag zone isn't visible if the main area is scrolled
- The document rotated initially isn't displayed properly

## v1.5.0

**New features**
- Highlight given keyword in the first render

~~~ javascript
<Viewer
    fileUrl='/path/to/document.pdf'
    // The `keyword` option can be a string or a regular expression
    // keyword='PDF Library'
    keyword={new RegExp('pdf document', 'i')}
/>
~~~

- Add new SVG layer which can be used to replace the canvas layer

~~~ javascript
const renderPage = (props: RenderPageProps) => {
    return (
        <>
            {props.svgLayer.children}
            {props.textLayer.children}
            {props.annotationLayer.children}
        </>
    );
};

<Viewer
    fileUrl='/path/to/document.pdf'
    renderPage={renderPage}
/>
~~~

- Customize page renderer. The following code adds a simple _Draft_ watermark at the center of every page:

~~~ javascript
const renderPage: RenderPage = (props: RenderPageProps) => (
    <>
        {props.canvasLayer.children}
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                left: 0,
                position: 'absolute',
                top: 0,
                width: '100%',
            }
        }>
            <div
                style={{
                    color: 'rgba(0, 0, 0, 0.2)',
                    fontSize: `${8 * props.scale}rem`,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    transform: 'rotate(-45deg)',
                    userSelect: 'none',
                }}
            >
                Draft
            </div>
        </div>
        {props.annotationLayer.children}
        {props.textLayer.children}
    </>
);

<Viewer
    fileUrl='/path/to/document.pdf'
    renderPage={renderPage}
/>
~~~

**Improvement**
- The default scale can be a special zoom level. For example, we can fit page in the container initially:

~~~ javascript
<Viewer
    fileUrl='/path/to/document.pdf'
    defaultScale={SpecialZoomLevel.PageFit}
/>
~~~

- The `fileUrl` option can be `Uint8Array`:

~~~ javascript
<Viewer
    fileUrl={new Uint8Array([...])}
/>
~~~

- Add styles for error message

## v1.4.0

**New features**
- Add new optional parameter indicating the page that will be displayed initially

~~~ javascript
<Viewer
    // The page is zero-based index
    // We will display the third page initially
    initialPage={2}
/>
~~~

- Add new optional parameter to define the prefix of CSS classes

~~~ javascript
<Viewer
    prefixClass='viewer'
/>
~~~

- Add new `render` parameter that includes many functions that could be called from outside of the component:

~~~ javascript
import Viewer, { RenderViewerProps, ScrollMode, SpecialZoomLevel, SelectionMode } from '@phuocng/react-pdf-viewer';

const render = (props: RenderViewerProps) => {
    return (
        <div>
            <div style={{ height: '500px' }}>
                {props.viewer}
            </div>
            <button onClick={() => props.jumpToPage(props.doc.numPages - 1)}>Jump to last page</button>
            <button onClick={() => props.rotate(90)}>Rotate +90 degrees</button>
            <button onClick={() => props.zoom(0.5)}>Zoom to 50%</button>
            <button onClick={() => props.zoom(SpecialZoomLevel.ActualSize)}>Zoom to actual size</button>
            <button onClick={() => props.changeScrollMode(ScrollMode.Wrapped)}>Switch to wrapped scrolling</button>
            <button onClick={() => props.changeSelectionMode(SelectionMode.Hand)}>Switch to hand tool</button>
            <button onClick={() => props.print()}>Print</button>
            <button onClick={() => props.download()}>Download</button>
        </div>
    );
};

<Viewer
    fileUrl='/path/to/document.pdf'
    render={render}
/>
~~~

**Improvement**
- All styles are moved to external CSS files. It's possible for us to override components' styles.

**Bug fixes**
- Can't scroll and print on IE 11
- Printing doesn't look good if the page size isn't set
- Blank page when print the current web page

## v1.3.0

**New features**
Expose all the buttons from the more actions popover to the toolbar.
`ToolbarSlot` now includes
- `goToFirstPageButton`: the button to go to the first page
- `goToLastPageButton`: go to the last page
- `rotateClockwiseButton`: rotate the document
- `rotateCounterclockwiseButton`: rotate counterclockwise the document
- `textSelectionButton`: switch to the text selection mode
- `handToolButton`: switch to the hand tool mode
- `verticalScrollingButton`: scroll the document vertically
- `horizontalScrollingButton`: scroll the document horizontally
- `wrappedScrollingButton`: display pages as a grid
- `documentPropertiesButton`: show the document properties

## v1.2.1

**Improvement**
- Make the spinner thiner
- Add minified CSS files

**Bug fixes**
- Tooltip for the left/right buttons don't look good in full width mode
- The view now takes full height by default. It fixes the issue that users can't navigate between pages from the toolbar in some cases

## v1.2.0

**New features**
- Provide the ability of printing document
- Add new `selectionMode` option indicates the selection mode:

~~~ javascript
import Viewer, { SelectionMode } from '@phuocng/react-pdf-viewer';

<Viewer
    fileUrl='/path/to/document.pdf'
    // By default, it will be SelectionMode.Text
    selectionMode={SelectionMode.Hand}
/>
~~~

- Add `onDocumentLoad` callback that uis invoked when the document is loaded completely

~~~ javascript
import Viewer, { PdfJs } from '@phuocng/react-pdf-viewer';

const documentLoad = (doc: PdfJs.PdfDocument) => {
    console.log(`Document is loaded: ${doc.numPages}`)
};

<Viewer
    fileUrl='/path/to/document.pdf'
    onDocumentLoad={documentLoad}
/>
~~~

- Add `onZoom` callback that is invoked when zooming in/out the document

~~~ javascript
import Viewer, { PdfJs } from '@phuocng/react-pdf-viewer';

const zoom = (doc: PdfJs.PdfDocument, scale: number) => {
    console.log(`Zoom document to ${scale}`);
};

<Viewer
    fileUrl='/path/to/document.pdf'
    onZoom={zoom}
/>
~~~

## v1.1.0

**New features**
- Add new, optional `defaultScale` parameter that indicates the default zoom level:

~~~ javascript
<Viewer defaultScale={1.5} ... />
~~~

**Improvement**
- The document should fit best in the container initially

## v1.0.2

**Improvement**
- Support SSR

**Bug fixes**
- Cannot re-export a type when --isolatedModules is set to true
- The CSS files are missing in es6 package

## v1.0.0

First release