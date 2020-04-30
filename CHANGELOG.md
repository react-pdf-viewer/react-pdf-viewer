# CHANGELOG

## v1.6.0 (not released yet)

**New features**

- The annotation layer is rewritten. Support the following type of annotations:
    * Free text
    * Link
    * Popup
    * Square
    * Text

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

**Bug fixes**
- The canvas layer is blurry
- The tooltip, popover positions are not correct in some cases
- The drag zone isn't visible if the main area is scrolled

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