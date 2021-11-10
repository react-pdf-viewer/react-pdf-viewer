# CHANGELOG

## v2.11.0 [WIP]

**New features**

-   The `Button` component has new `testId` property that is identical with the `data-testid` attribute
-   The Scroll Mode plugin provides new function to switch mode programatically:

```js
const scrollModePluginInstance = scrollModePlugin();
const { switchTo } = scrollModePluginInstance;

// Switch to Wrapped mode
switchTo(ScrollMode.Wrapped);
```

You might find it useful when using with the full screen plugin. The following sample code switches the scroll mode after entering the full screen mode:

```js
const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
        fullScreenPlugin: {
            onEnterFullScreen: (zoom) => {
                zoom(SpecialZoomLevel.PageFit);
                defaultLayoutPluginInstance.toolbarPluginInstance.scrollModePluginInstance.switchScrollMode(
                    ScrollMode.Wrapped
                );
            },
            onExitFullScreen: (zoom) => {
                zoom(SpecialZoomLevel.PageWidth);
                defaultLayoutPluginInstance.toolbarPluginInstance.scrollModePluginInstance.switchScrollMode(
                    ScrollMode.Horizontal
                );
            },
        },
    },
});
```

**Improvements**

-   Cache pages' labels. So we won't see blink in the current page label when navigating between pages
-   Keep the file name when downloading a file opened from local
-   It's possible to remove the sidebar created by the default layout plugin:

```js
const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
});
```

**Bug fixes**

-   Can't use special characters such as `(`, `)`, `[`, `]`, `*` in the keyword
-   The Get File plugin doesn't work with a file which is opened with credentials
-   The highlight area aren't displayed
-   The `selectedText` prop of `RenderHighlightContentProps` isn't correct

## v2.10.1

**New feature**

-   The `Zoom` and `ZoomPopover` components provided by the zoom plugin adds a custom zoom levels

```tsx
<Zoom levels={[0.5, 1, 2, 3, 4]} />

<ZoomPopover levels={[0.5, 1, 2, 3, 4]} />
```

**Bug fix**

-   Clicking the Search button scrolls to the top of page

## v2.10.0

**New features**

-   Add new `trigger` option for the Highlight plugin

```js
import { Trigger } from '@react-pdf-viewer/highlight';

const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.None,
});
```

There are two possible values for the `trigger` option:

| Value                             | Description                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `Trigger.TextSelection` (default) | Show the target after users select text                                       |
| `Trigger.None`                    | Doesn't trigger the highlight. It is often used to render the highlight areas |

-   The render props of the `CurrentPageLabel` component provided by the Page Navigation plugin includes new `pageLabel` property.
    It is useful if the page has a label that isn't the same as its page number:

```js
const { CurrentPageLabel } = pageNavigationPluginInstance;

<CurrentPageLabel>
    {(props) => (
        <>
            {props.numberOfPages}
            {props.pageLabel !== `${props.currentPage + 1}` && `(${props.pageLabel})`}
        </>
    )}
</CurrentPageLabel>;
```

-   The `Thumbnails` component displays the page labels if there are. You also can customize the page labels:

```js
const thumbnailPluginInstance = thumbnailPlugin({
    renderCurrentPageLabel: (props) => (
        <>
            {props.pageIndex + 1}
            {props.pageLabel !== `${props.pageIndex + 1}` && `(${props.pageLabel})`}
        </>
    ),
});
const { Thumbnails } = thumbnailPluginInstance;

<Thumbnails />;
```

-   The Toolbar plugin provides the `renderDefaultToolbar` function to create a custom toolbar from the default toolbar easily.
    The following sample code prepends `of` to the `NumberOfPages` component:

```js
import type { ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';

const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

const transform: TransformToolbarSlot = (slot: ToolbarSlot) => {
    const { NumberOfPages } = slot;
    return Object.assign({}, slot, {
        NumberOfPages: () => (
            <>
                of <NumberOfPages />
            </>
        ),
    });
};

// Render the toolbar
<Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;
```

**Improvement**

-   Disable the printing functionality if the document doesn't allow to print

**Bug fixes**

-   Can't resize the sidebar when using with the [Fluent UI](https://developer.microsoft.com/en-us/fluentui) library
-   Fix the TypeScript definition of the `Cover` component
-   Fix an edge case where there are extra empty pages when printing a document

## v2.9.1

**Improvement**

As we know, the `Viewer` component only renders the pages which are visible in the screen. For an invisible page, users will see a spinner. However, the animation used in the `Spinner` component can slow down the app if the document has a big number of pages.

This version improves the performance by animating the `Spinner` component when it's visible only.

## v2.9.0

**New features**

-   The `core` package provides new `Splitter` component
-   The `thumbnail` plugin provides new `Cover` component that shows the thumbnail of a particular page:

```js
const { thumbnailPluginInstance } = thumbnailPlugin();
const { Cover } = thumbnailPluginInstance;

// Thumbnail of the first page
<Cover getPageIndex={_ => 0} />

// Thumbnail of the last page
<Cover getPageIndex={props => props.numPages - 1} />
```

-   Add new `onDocumentAskPassword` event that is triggered when a protected document requires a password to open:

```js
const handleAskPassword = (e: DocumentAskPasswordEvent) => {
    // ...
};

<Viewer onDocumentAskPassword={handleAskPassword} />;
```

**Improvements**

-   Automatically focus on the keyword input in the search popover
-   Press `Enter` to submit the password when opening a protected document
-   Show the page numbers for thumbnails
-   The Default Layout plugin allows to resize the sidebar
-   The plugin instances which can be accessed from an instance of the Default Layout or Toolbar plugin should be readonly
-   Support more shortcuts

| Shortcut                                                          | Supported plugin                                                 | Action                     |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------- |
| <kbd>ctrl</kbd> + <kbd>cmd</kbd> + <kbd>F</kbd> or <kbd>F11</kbd> | [Full screen](https://react-pdf-viewer.dev/plugins/full-screen/) | Enter the full screen mode |
| <kbd>cmd</kbd> + <kbd>O</kbd>                                     | [Open](https://react-pdf-viewer.dev/plugins/open/)               | Open a document            |
| <kbd>cmd</kbd> + <kbd>F</kbd>                                     | [Search](https://react-pdf-viewer.dev/plugins/search/)           | Open the search popover    |

The shortcuts are enabled by default. It's possible to disable them, for example:

```js
// Use the standalone open plugin
const openPluginInstance = openPlugin({
    enableShortcuts: false,
});

// Use the default layout plugin
const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
        openPlugin: {
            enableShortcuts: false,
        },
    },
});
```

## v2.8.0

**New features**

-   Support RTL

```js
import { TextDirection, Viewer } from '@react-pdf-viewer/core';

<Viewer
    theme={{
        direction: TextDirection.RightToLeft,
    }}
/>;
```

-   The `RenderViewer` type includes the theme context

**Bug fixes**

-   The highlighting elements should be shown below the text, so users can still select the text
-   There is an exception when opening a password protected document

## v2.7.2

**New feature**

The `Search` plugin provides new function named `setTargetPages` which sets the pages that you want to search in.

```js
import { searchPlugin } from '@react-pdf-viewer/search';

const searchPluginInstance = searchPlugin();
const { setTargetPages } = searchPluginInstance;

// Only search in even pages
setTargetPages((targetPage) => targetPage.pageIndex % 2 === 0);

// Only search in the page 4
setTargetPages((targetPage) => targetPage.pageIndex === 3);
```

**Improvements**

-   Allow to change the theme from outside of the `Viewer` component
-   When the default scale is set to a special zoom level, we should keep it when resizing the window
-   The `onDocumentLoad` event and plugins' `PluginOnDocumentLoad` callback provide access to the current opened file which contains the `data` and `name` properties:

```js
const handleDocumentLoad = (e: DocumentLoadEvent) => {
    console.log(e.file.name, e.file.data);
};

<Viewer onDocumentLoad={handleDocumentLoad} />;
```

**Bug fixes**

-   Can't close the menu when using with the [Fluent UI](https://developer.microsoft.com/en-us/fluentui)
-   The `activateTab()` method provided by the [default layout](https://react-pdf-viewer.dev/plugins/default-layout) plugin shouldn't toggle the tab
-   The `LocalePopover` component doesn't update the localization
-   The pages' container overflows on initial render when setting the default scale to `SpecialZoomLevel.PageWidth`

## v2.7.1

**Improvement**

Continue improving the accessibility:

| Component | Press key | Action                       |
| --------- | --------- | ---------------------------- |
| `Menu`    | `End`     | Focus on the last menu item  |
|           | `Home`    | Focus on the first menu item |

**Bug fixes**

-   Automatically scroll to the top of page when opening a menu
-   Fix the warning when pressing the _Escape_ key to close a modal

## v2.7.0

**New features**

-   Add new `onSwitchTheme` option that allows to track if users switch theme. The following snippet demonstrates an example that the current theme is stored in the local storage, and is loaded back in the next user's visit:

```js
const handleSwitchTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
};
const theme = localStorage.getItem('theme') || 'light';

<Viewer theme={theme} onSwitchTheme={handleSwitchTheme} />;
```

_Improve the search plugin_

-   Add new `jumpToMatch` function which jumps to the given match
-   The `highlight` function now returns a `Promise` that holds the results. Each result also contains the matching text

-   The `core` package provides `isMac` function

**Improvements**

_Accessibility_

-   Add ARIA attributes to `Icon`, `Menu`, `MenuDivider`, `MenuItem`, `MinimalButton`, `Modal`, `Popover`, `TextBox`, `Tooltip` components
-   Add ARIA attributes to pages and thumbnails
-   Add ARIA attributes to internal links of the document
-   When the shortcuts are enabled, the associal buttons will have the `aria-keyshortcuts` attributes
-   Use the keyboard to navigate between components:

| Component     | Press key    | Action                                      |
| ------------- | ------------ | ------------------------------------------- |
| `Attachments` | `ArrowDown`  | Focus on the next attachment                |
|               | `ArrowUp`    | Focus on the previous attachment            |
|               | `End`        | Focus on the last attachment                |
|               | `Enter`      | Download the current focused attachment     |
|               | `Home`       | Focus on the first attachment               |
| `Bookmark`    | `ArrowDown`  | Focus on the next bookmark                  |
|               | `ArrowLeft`  | Collapse the current bookmark               |
|               | `ArrowRight` | Expand the current bookmark                 |
|               | `ArrowUp`    | Focus on the previous bookmark              |
|               | `End`        | Focus on the last bookmark                  |
|               | `Enter`      | Click the current focused bookmark          |
|               | `Home`       | Focus on the first bookmark                 |
|               | `Space`      | Click the current focused bookmark          |
| `Menu`        | `ArrowDown`  | Focus on the next menu item                 |
|               | `ArrowUp`    | Focus on the previous menu item             |
|               | `Enter`      | Click the current focused item              |
| `Thumbnails`  | `ArrowDown`  | Focus on the thumbnail of next page         |
|               | `ArrowUp`    | Focus on the thumbnail of the previous page |
|               | `Enter`      | Jump to the associate page                  |
| `Tooltip`     | `Escape`     | Close                                       |
|               | `Tab`        | Show when being focused                     |
|               |              | Close when being blured                     |

-   Add a background color to the current search highlight
-   Show a loading indicator while searching for a keyword
-   The `Spinner` component adds new `size` property

**Bug fixes**

-   Custom search control isn't rendered
-   Pressing shortcuts effects all viewer instances in the same page. The shortcuts should be enabled when the viewer gets focused.
-   Remove `br` elements generated by the recent versions of pdf.js before rendering the text layer
-   Remove `keyCode` usages because it's deprecated
-   The print progress container loses the border
-   The search popover isn't shown until the document is loaded

## v2.6.1

**Improvements**

-   Move the CSS variables of the default theme to `:root`, so we can use components (`Button`, `Menu`, `Tooltip`, etc.) outside of the `Viewer`
-   Update the `DownloadIcon`, `ExitFullScreenIcon`, `FullScreenIcon` and `OpenFileIcon` icons

**Bug fixes**

-   Remove duplicate borders of keyword input
-   Search results are not highlighted
-   The [Search plugin](/https://react-pdf-viewer.dev/plugins/search) can cause a re-render

## v2.6.0

From this version, all the components use the BEM naming convention for CSS classes. So if you override the styles of given class, you need to change the class.

The CSS classes are named as `rpv-PACKAGE__COMPONENT`, `rpv-PACKAGE__COMPONENT--STATE`. For example:

```css
/* Old version */
.rpv-search-highlight {
    ...;
}
.rpv-search-highlight-current {
    ...;
}

/* From v2.6.0 */
.rpv-search__highlight {
    ...;
}
.rpv-search__highlight--current {
    ...;
}
```

**New features**

-   The core package provides new `TextBox` component
-   Support themes. You can create a custom theme with new `theme` option:

```js
<Viewer theme="bootstrap" />
```

The main viewer then will have the class `rpv-core__viewer--bootstrap`. You can set the value for CSS variables which are provided by plugins:

```css
.rpv-core__viewer--bootstrap {
    /* Custom the background color of toolbar in the default layout */
    --rpv-default-layout__toolbar-background-color: #eee;
}
```

The following built-in themes are provided:

| Theme                      | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| `<Viewer theme='auto' />`  | Switch to the dark or light mode automatically based on the system setting |
| `<Viewer theme='dark' />`  | The dark theme                                                             |
| `<Viewer theme='light' />` | The light theme (default)                                                  |
| `<Viewer theme='' />`      | The light theme (default)                                                  |

-   Add new theme plugin that provides components for switching between the dark and light themes
-   The toolbar Slot has new `SwitchTheme` and `SwitchThemeMenuItem`

**Improvements**

-   Tweak toggle icons in bookmark items
-   The [bookmark plugin](https://react-pdf-viewer.dev/plugins/bookmark) provide new icons: `DownArrowIcon` and `RightArrowIcon`
-   Improve text selection in the [highlight plugin](https://react-pdf-viewer.dev/plugins/highlight)
-   You can enable or disable shortcuts in the print and zoom plugins:

```js
const printPluginInstance = printPlugin({
    // The shortcuts are enabled by default
    enableShortcuts: false,
});

const zoomPluginInstance = zoomPlugin({
    // The shortcuts are enabled by default
    enableShortcuts: false,
});
```

**Bug fixes**

-   Can't close popovers after scrolling
-   Can't open any popover after printing
-   Icons in menu items aren't centered horizontally
-   There is an exception when jumping to the next or previous match if the keyword isn't found

**Breaking change**

-   The `toolbar` plugin doesn't include the `drop` plugin anymore. In order to use the drop plugin, you have to register it
-   `Button` is renamed to `MinimalButton`
-   The option `prefixClass` is removed

## v2.5.0

**New features**

-   The default layout is responsive in different screen sizes
-   You can add more options that will be passed to the [pdf.js `getDocument`](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html) API:

```js
<Viewer
    fileUrl="..."
    transformGetDocumentParams={(options: PdfJs.GetDocumentParams) =>
        Object.assign({}, options, {
            disableRange: false,
            disableStream: false,
        })
    }
/>
```

-   Provide more reusable components:

| Component                      | Provided by plugin                                                         | Description                    |
| ------------------------------ | -------------------------------------------------------------------------- | ------------------------------ |
| `DownloadMenuItem`             | [Get File](https://react-pdf-viewer.dev/plugins/get-file)                  | Download the current file      |
| `EnterFullScreenMenuItem`      | [Full screen](https://react-pdf-viewer.dev/plugins/full-screen)            | Enter the full screen mode     |
| `GoToNextPageMenuItem`         | [Page Navigation](https://react-pdf-viewer.dev/plugins/page-navigation)    | Go to the next page            |
| `GoToPreviousPageMenuItem`     | [Page Navigation](https://react-pdf-viewer.dev/plugins/page-navigation)    | Go to the previous page        |
| `OpenMenuItem`                 | [Open](https://react-pdf-viewer.dev/plugins/open)                          | Open a new file                |
| `PrintMenuItem`                | [Print](https://react-pdf-viewer.dev/plugins/print)                        | Print the current file         |
| `ZoomInMenuItem`               | [Zoom](https://react-pdf-viewer.dev/plugins/zoom)                          | Zoom in the current file       |
| `ZoomOutMenuItem`              | [Zoom](https://react-pdf-viewer.dev/plugins/zoom)                          | Zoom out the current file      |

These components are available as [Toolbar slots](https://react-pdf-viewer.dev/plugins/toolbar), so it's possible to add them to a custom toolbar

**Improvements**

-   Decrease the number of renders from twice to once when setting the default scale
-   The `Button` and `MenuItem` components have disabled state. For example, the button for going to the first page will be disabled if we're at the first page
-   The icons use the current color instead of hard coded one. It's easier for us to create themes

**Bug fixes**

-   Doesn't work with NextJS because `navigator` isn't defined
-   Some bookmarks are hidden initially
-   The `initialPage` and `defaultScale` options don't work together
-   There are big spaces between thumbnails
-   Zoom the document best inside the container initially

**Breaking changes**

-   If you are creating a custom toolbar or buttons to go to particular pages, then the following props are renamed:

| Old name                       | New name               |
| ------------------------------ | ---------------------- |
| `GoToFirstPageProps`           | `GoToPageProps`        |
| `GoToLastPageProps`            | `GoToPageProps`        |
| `GoToNextPageProps`            | `GoToPageProps`        |
| `GoToPreviousPageProps`        | `GoToPageProps`        |
| `RenderGoToFirstPageProps`     | `RenderGoToPageProps`  |
| `RenderGoToLastPageProps`      | `RenderGoToPageProps`  |
| `RenderGoToNextPageProps`      | `RenderGoToPageProps`  |
| `RenderGoToPreviousPageProps`  | `RenderGoToPageProps`  |

## v2.4.3

**Bug fix**

-   Clicking on an internal link jumps to an incorrect page (one page after the destination one)

**Improvements**

-   Automatically scroll to the thumbnail that represents the current page
-   Display the progress properly when printing a big document
-   Improve the performance of preparing pages for print such as using a shared `canvas` element for all pages
-   Keep showing a spinner until the canvas layer is rendered completely
-   The print plugin supports documents whose pages have different dimensions

## v2.4.2

**Bug fixes**

-   Can't delete the last remaining digit in the page number input
-   Properly check whether or not the `fileUrl` changes
-   Fix the issue where we see the spinner if the document has a single page and the height is smaller than the viewer's height
-   Can't open the downloaded file if it was loaded with `Uint8Array`
-   Annotation popup can be displayed under the previous or next page
-   When users download a document loaded with `Uint8Array`, the download file is named as `document.pdf` instead of the document blob
-   Clicking a bookmark doesn't jump to the destination properly in the first time if the bookmark also requires to zoom the document to fit the width

**Improvements**

-   Display the current page number in the right
-   Make the content of annotation scrollable
-   Support shortcuts

| Shortcut                      | Supported plugin                                     | Action                |
| ----------------------------- | ---------------------------------------------------- | --------------------- |
| <kbd>cmd</kbd> + <kbd>p</kbd> | [Print](https://react-pdf-viewer.dev/plugins/print/) | Print the document    |
| <kbd>cmd</kbd> + <kbd>-</kbd> | [Zoom](https://react-pdf-viewer.dev/plugins/zoom/)   | Zoom out the document |
| <kbd>cmd</kbd> + <kbd>+</kbd> | [Zoom](https://react-pdf-viewer.dev/plugins/zoom/)   | Zoom in the document  |
| <kbd>cmd</kbd> + <kbd>0</kbd> | [Zoom](https://react-pdf-viewer.dev/plugins/zoom/)   | Reset zoom to 100%    |

## v2.4.1

**Bug fixes**

-   Clicking the Download button doesn't work. It only works the file when scrolling to the second page
-   Using the Default Layout plugin, we can't scroll between pages on Safari 14
-   The Open file button covers other elements, so we can't click on the Download or Print buttons. This issue only happens on Safari 14

## v2.4.0

**New features**

-   The Search plugin provides methods to search for given keywords programatically:

| Method                | Description                 |
| --------------------- | --------------------------- |
| `clearHighlights`     | Clear the highlights        |
| `highlight`           | Highlight multiple keywords |
| `jumpToNextMatch`     | Jump to the next match      |
| `jumpToPreviousMatch` | Jump to the previous match  |

```javascript
import { searchPlugin } from '@react-pdf-viewer/search';
const searchPluginInstance = searchPlugin();

const { clearHighlights, highlight, jumpToNextMatch, jumpToPreviousMatch } = searchPluginInstance;

<button onClick={() => highlight(['document', 'PDF'])}>Highlight: document, PDF</button>;
```

-   It's possible to add custom styles for highlighted area based on the keyword:

```javascript
const searchPluginInstance = searchPlugin({
    onHighlightKeyword: (props: OnHighlightKeyword) => {
        if (props.keyword.source === 'document') {
            props.highlightEle.style.outline = '2px dashed blue';
            props.highlightEle.style.backgroundColor = 'rgba(0, 0, 0, .1)';
        }
    },
});
```

-   The Zoom plugin exposes the `zoomTo` function:

```javascript
const { zoomTo } = zoomPluginInstance;

// Zoom to a given level
zoomTo(1.5);
zoomTo(SpecialZoomLevel.PageFit);
```

-   The Page Navigation plugin provides the `jumpToPage` function:

```javascript
const { jumpToPage } = pageNavigationPluginInstance;

// Jump to the third page
jumpToPage(2);
```

-   It's possible to retrieve the instances of _Attachment_, _Bookmark_, _Thumbnail_, _Toolbar_ plugins from the _Default Layout_ plugin instance.

```javascript
const defaultLayoutPluginInstance = defaultLayoutPlugin();

const { attachmentPluginInstance, bookmarkPluginInstance, thumbnailPluginInstance, toolbarPluginInstance } =
    defaultLayoutPluginInstance;
```

Similarity, the _Toolbar_ plugin instance provides the accesses to the instance of other plugins that build the toolbar:

```javascript
const toolbarPluginInstance = toolbarPlugin();

const {
    dropPluginInstance,
    fullScreenPluginInstance,
    getFilePluginInstance,
    openPluginInstance,
    pageNavigationPluginInstance,
    printPluginInstance,
    propertiesPluginInstance,
    rotatePluginInstance,
    scrollModePluginInstance,
    searchPluginInstance,
    selectionModePluginInstance,
    zoomPluginInstance,
} = toolbarPluginInstance;
```

**Improvements**

-   Support Next.js integration
-   Fix a warning in the Console when using with Next.js
-   The `SingleKeyword` type in the `Search` plugin supports flags:

```javascript
interface FlagKeyword {
    keyword: string;
    matchCase?: boolean; // `false` by default
    wholeWords?: boolean; // `false` by default
}

type SingleKeyword = string | RegExp | FlagKeyword;
```

You can use these flags when passing the keywords:

```javascript
const searchPluginInstance = searchPlugin({
    keyword: {
        keyword: 'document',
        matchCase: true,
    },
});
```

**Bug fixes**

-   The Search plugin can find text that belongs to multiple `span` elements
-   Fix the type definitions of the `MoreActionsPopover` component in the Toolbar plugin

**Breaking changes**

-   The `Observer` component is removed from the `@react-pdf-viewer/core` package

## v2.3.2

**Improvements**

-   Lazy load the document. The PDF document will be loaded if the viewer container is visible in the viewport.

**Bug fixes**
Fix a bug that could happen when we load multiple documents by changing `fileUrl`.
In that case, you may see the error message

-   `Worker was destroyed`
-   `Cannot read property 'sendWithPromise' of null`

This version also fixes a potential memory leaks reported by React DevTools when we try to load new document even if the current document isn't rendered completely.

## v2.3.1

**Improvements**

-   `full-screen` plugin provides new callbacks that are triggered after entering and exiting the full screen mode

```javascript
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';

const fullScreenPluginInstance = fullScreenPlugin({
    // Zoom to fit the screen after entering and exiting the full screen mode
    onEnterFullScreen: (zoom) => {
        zoom(SpecialZoomLevel.PageFit);
    },
    onExitFullScreen: (zoom) => {
        zoom(SpecialZoomLevel.PageFit);
    },
});
```

**Bug fixes**

-   The style files are missing in the `highlight` plugin
-   Render highlight annotations formed by quadrilaterals
-   The popup annotations aren't shown if they are children of highlight annotations
-   Clicking a destination (bookmark, for example) with name of `FitH` or `FitBH` throws an exception

## v2.3.0

**New features**

-   New `highlight` plugin provides the ability of selecting and adding notes for text in the document
-   The `default-layout` plugin allows to customize the tabs:

```javascript
// `defaultTabs` is the list of default tabs which lists thumbnails, bookmarks and attachments respetively
const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: defaultTabs => { ... }
});
```

We also can activate a given tab:

```javascript
const { activateTab } = defaultLayoutPluginInstance;

// Activate a tab
// activateTab(index);
```

**Breaking changes**

-   The `getPagesRef` method in plugins are changed to `getPagesContainer`:

```javascript
// Before
interface PluginFunctions {
    getPagesRef(): React.RefObject<HTMLDivElement>;
}

// After
interface PluginFunctions {
    getPagesContainer(): HTMLElement;
}
```

-   The `authorization` option is removed. You can use new `withCredentials` option:

```javascript
// Before v2.3.0
<Viewer
    fileUrl={...}
    authorization='Bearer ...'
/>

// From v2.3.0
<Viewer
    fileUrl={...}
    withCredentials={true}
    httpHeaders={{
        'Authorization': 'Bearer ...',
    }}
/>
```

## v2.2.1

**Improvements**

-   Keep the current page and scroll position after zooming the document
-   Pre-render a few of previous and next pages of the current page, so users see the page instantly when scrolling

## v2.2.0

**New features**

-   Support loading PDF from a protected resource with new `authorization` option.

```javascript
import { Viewer } from '@react-pdf-viewer/core';

<Viewer
    fileUrl={...}
    authorization='Bearer ...'
/>
```

If you want to use another authorization servers or send more additional authentication headers, then use the new `httpHeaders` option, for example:

```javascript
import { Viewer } from '@react-pdf-viewer/core';

<Viewer
    fileUrl={...}
    authorization='...'
    httpHeaders={{
        key: value,
    }}
/>
```

-   It's possible to customize the search control with the new `Search` component:

```javascript
import { RenderSearchProps, Search } from '@react-pdf-viewer/search';

<Search>
{
    (renderSearchProps: RenderSearchProps) => (
        // Your custom search control
    )
}
</Search>
```

The parameter `renderSearchProps` provides the properties and methods to build up a custom search control:

| Property              | Type       | Description                                                                        |
| --------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `clearKeyword`        | `Function` | Clear the keyword                                                                  |
| `changeMatchCase`     | `Function` | The result has to match case with the keyword                                      |
| `changeWholeWords`    | `Function` | The result has to match the whole keyword                                          |
| `currentMatch`        | `number`   | The index of current match                                                         |
| `jumpToNextMatch`     | `Function` | Jump to the next match                                                             |
| `jumpToPreviousMatch` | `Function` | Jump to the previous match                                                         |
| `keyword`             | `string`   | The current keyword                                                                |
| `matchCase`           | `boolean`  | `true` if the result matches case with the keyword                                 |
| `wholeWords`          | `boolean`  | `true` if the result matches the whole keyword                                     |
| `search`              | `Function` | Perform the search with current `keyword` and `matchCase`, `wholeWords` conditions |
| `setKeyword`          | `Function` | Set the current keyword                                                            |

**Improvements**

-   A current match search has a custom class `rpv-search-text-highlight-current`. So you can customize the current match by adding CSS properties for the class.
-   Avoid the black flickering when clicking a bookmark
-   Support both React v16 and v17

**Bug fixes**

-   The [print plugin](https://react-pdf-viewer.dev/plugins/print/) doesn't work with default-layout plugin
-   In some cases, there is an extra blank page when printing
-   Clicking [bookmark](https://react-pdf-viewer.dev/plugins/bookmark) doesn't jump to correct page in horizontal [scroll mode](https://react-pdf-viewer.dev/plugins/scroll-mode)
-   Jumping between [search](https://react-pdf-viewer.dev/plugins/search) match doesn't work properly in horizontal [scroll mode](https://react-pdf-viewer.dev/plugins/scroll-mode)

**Breaking changes**

-   The `onCanvasLayerRender` option is removed. Instead, use the `onCanvasLayerRender` option in your plugin.
-   The `TextLayerRenderStatus` enum is renamed to `LayerRenderStatus`.

## v2.1.0

**New features**

-   Add `onAnnotationLayerRender` hook for plugin. We can perform custom action after annotations are rendered.
    The following sample code creates a plugin that finds all annotation links, and add the `target="_blank"` attribute to the links:

```javascript
import { AnnotationType, Plugin, PluginOnAnnotationLayerRender } from '@react-pdf-viewer/core';

const customPlugin = (): Plugin => {
    const onRenderAnnotations = (e: PluginOnAnnotationLayerRender) => {
        // Find all `Link` annotation
        e.annotations
            .filter((annotation) => annotation.annotationType === AnnotationType.Link)
            .forEach((annotation) => {
                if (annotation.url) {
                    // Find the `a` element represents the link
                    [...e.container.querySelectorAll('.rpv-core-annotation-link a')].forEach((linkEle) => {
                        linkEle.setAttribute('target', '_blank');
                    });
                }
            });
    };

    return {
        onAnnotationLayerRender: onRenderAnnotations,
    };
};
```

-   The [search plugin](https://react-pdf-viewer.dev/plugins/search) allows to set multiple keywords to be highlighted initially

```javascript
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
```

**Improvements**

-   Optimize the [search plugin](https://react-pdf-viewer.dev/plugins/search) that doesn't perform unhighligting and highlighting many times after texts are rendered

**Bug fixes**

-   Clicking _Previous match_ or _Next match_ button throws an error if the keyword is empty
-   Fix the incorrect path of styles

**Upgrade from 2.0.1 to 2.1.0**

We have to update the path of styles which are placed in the `lib` directory. For example:

```javascript
// Old version
import '@react-pdf-viewer/core/styles/index.css';

// New version
import '@react-pdf-viewer/core/lib/styles/index.css';
```

## v2.0.1

This version rewrites the entire viewer with the plugin architecture. The main viewer component `Viewer` is very lightweight,
and everything else is powered by plugins.

The basic setup looks like following:

```javascript
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
```

**New features**

-   `Viewer` supports to use a custom loader instead of the default `<Spinner>`:

```javascript
import { ProgressBar, Viewer } from '@react-pdf-viewer/core';

<Viewer
    renderLoader={(percentages: number) => (
        // You can use your own progress bar component
        <div style={{ width: '240px' }}>
            <ProgressBar progress={Math.round(percentages)} />
        </div>
    )}
/>;
```

-   Customizable name of download file with the [get-file](https://react-pdf-viewer.dev/plugins/get-file) plugin:

```javascript
const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: (file: OpenFile) => {
        // `file.name` is the URL of opened file
        const fileName = file.name.substring(file.name.lastIndexOf('/') + 1);
        return `a-copy-of-${fileName}`;
    },
});
```

-   New [Locale Switcher](https://react-pdf-viewer.dev/plugins/locale-switcher) plugin for switching between different locales
-   Provide the ability of setting the scroll mode via the [Scroll Mode](https://react-pdf-viewer.dev/plugins/scroll-mode) plugin.

**Bug fixes**

-   The `onPageChange` could be invoked several times when clicking an outline item

**Breaking changes**

-   The `keyword` option is removed. Use the `keyword` option provided by the [search plugin](https://react-pdf-viewer.dev/plugins/search).
-   The `layout` option is removed
-   The `render` option is removed
-   The `selectionMode` option is removed. Use the `selectionMode` option provided by the [selection-mode plugin](https://react-pdf-viewer.dev/plugins/selection-mode).
-   The `onTextLayerRender` option is removed. Instead, use the `onTextLayerRender` option in your plugin.

**Upgrade from 1.7.0 to 2.0.0**

_Uninstall the old packages:_

```console
npm uninstall pdfjs-dist
npm uninstall @phuocng/react-pdf-viewer
```

_Install the new packages:_

```console
npm install pdfjs-dist@2.5.207
npm install @react-pdf-viewer/core@2.0.1
```

_Replace the old \`Worker\` with new one:_

```javascript
// Remove the old Worker
import { Worker } from '@phuocng/react-pdf-viewer';

// Use the new Worker
import { Worker } from '@react-pdf-viewer/core';
```

_Use the new `Viewer`:_

-   First, you might need to install the [Default Layout](https://react-pdf-viewer.dev/plugins/default-layout) plugin:

```console
npm install @react-pdf-viewer/default-layout@2.0.0
```

-   Replace the old `Viewer` with new one:

```javascript
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
```

## v1.7.0

**New features**

-   Add `onPageChange` callback that is invoked when user changes page:

```javascript
import Viewer, { PageChangeEvent } from '@phuocng/react-pdf-viewer';

const handlePageChange = (e: PageChangeEvent) => {
    console.log(`Changed to page: ${e.currentPage}`);
};

<Viewer fileUrl="/path/to/document.pdf" onPageChange={handlePageChange} />;
```

-   Add `onCanvasLayerRender` event that is invoked when the canvas layer is rendered completely.

```javascript
import Viewer, { CanvasLayerRenderEvent } from '@phuocng/react-pdf-viewer';

const onCanvasLayerRender = (e: CanvasLayerRenderEvent) => {
    // `e.ele` is the canvas element
    const canvas = e.ele;
    // Do something with the canvas element
};

<Viewer fileUrl="/path/to/document.pdf" onCanvasLayerRender={onCanvasLayerRender} />;
```

-   Add `onTextLayerRender` event that is invoked when the text layer is ready.

```javascript
import Viewer, { TextLayerRenderEvent } from '@phuocng/react-pdf-viewer';

const onTextLayerRender = (e: TextLayerRenderEvent) => {
    // For example, we can find all text elements that look like a link,
    // and replace it with `a` elements
};

<Viewer fileUrl="/path/to/document.pdf" onTextLayerRender={onTextLayerRender} />;
```

-   Support non-latin characters via the `characterMap` option

```javascript
import Viewer, { CharacterMap } from '@phuocng/react-pdf-viewer';

const characterMap: CharacterMap = {
    isCompressed: true,
    url: 'https://unpkg.com/pdfjs-dist@2.4.456/cmaps/',
};

<Viewer characterMap={characterMap} fileUrl="/path/to/document.pdf" />;
```

**Bug fixes**

-   The viewer doesn't jump to the destination or searching result exactly

**Breaking changes**

The parameters of `onDocumentLoad` and `onZoom` are changed as following:

| v1.6.0                | v1.7.0                    |
| --------------------- | ------------------------- |
| `onDocumentLoad(doc)` | `onDocumentLoad({ doc })` |
| `onZoom(doc, scale)`  | `onZoom({ doc, scale })`  |

## v1.6.0

**New features**

-   The annotation layer is rewritten. Support the following type of annotations:

    -   Caret
    -   Circle
    -   File attachment
    -   Free text
    -   Highlight
    -   Ink
    -   Line
    -   Link
    -   Polygon
    -   Polyline
    -   Popup
    -   Square
    -   Squiggly
    -   Stamp
    -   StrikeOut
    -   Text
    -   Underline

-   The link annotation supports named actions which allow to jump to the first, last, next or previous pages
-   Customize error renderer.

```javascript
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

    return <div>{message}</div>;
};

<Viewer fileUrl={fileUrl} renderError={renderError} />;
```

**Improvements**

-   Allow to control the `fileUrl` option
-   Bookmarks support external links
-   Support external links

**Bug fixes**

-   The canvas layer is blurry
-   The tooltip, popover positions are not correct in some cases
-   The drag zone isn't visible if the main area is scrolled
-   The document rotated initially isn't displayed properly

## v1.5.0

**New features**

-   Highlight given keyword in the first render

```javascript
<Viewer
    fileUrl="/path/to/document.pdf"
    // The `keyword` option can be a string or a regular expression
    // keyword='PDF Library'
    keyword={new RegExp('pdf document', 'i')}
/>
```

-   Add new SVG layer which can be used to replace the canvas layer

```javascript
const renderPage = (props: RenderPageProps) => {
    return (
        <>
            {props.svgLayer.children}
            {props.textLayer.children}
            {props.annotationLayer.children}
        </>
    );
};

<Viewer fileUrl="/path/to/document.pdf" renderPage={renderPage} />;
```

-   Customize page renderer. The following code adds a simple _Draft_ watermark at the center of every page:

```javascript
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
            }}
        >
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

<Viewer fileUrl="/path/to/document.pdf" renderPage={renderPage} />;
```

**Improvement**

-   The default scale can be a special zoom level. For example, we can fit page in the container initially:

```javascript
<Viewer fileUrl="/path/to/document.pdf" defaultScale={SpecialZoomLevel.PageFit} />
```

-   The `fileUrl` option can be `Uint8Array`:

```javascript
<Viewer
    fileUrl={new Uint8Array([...])}
/>
```

-   Add styles for error message

## v1.4.0

**New features**

-   Add new optional parameter indicating the page that will be displayed initially

```javascript
<Viewer
    // The page is zero-based index
    // We will display the third page initially
    initialPage={2}
/>
```

-   Add new optional parameter to define the prefix of CSS classes

```javascript
<Viewer prefixClass="viewer" />
```

-   Add new `render` parameter that includes many functions that could be called from outside of the component:

```javascript
import Viewer, { RenderViewerProps, ScrollMode, SpecialZoomLevel, SelectionMode } from '@phuocng/react-pdf-viewer';

const render = (props: RenderViewerProps) => {
    return (
        <div>
            <div style={{ height: '500px' }}>{props.viewer}</div>
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

<Viewer fileUrl="/path/to/document.pdf" render={render} />;
```

**Improvement**

-   All styles are moved to external CSS files. It's possible for us to override components' styles.

**Bug fixes**

-   Can't scroll and print on IE 11
-   Printing doesn't look good if the page size isn't set
-   Blank page when print the current web page

## v1.3.0

**New features**
Expose all the buttons from the more actions popover to the toolbar.
`ToolbarSlot` now includes

-   `goToFirstPageButton`: the button to go to the first page
-   `goToLastPageButton`: go to the last page
-   `rotateClockwiseButton`: rotate the document
-   `rotateCounterclockwiseButton`: rotate counterclockwise the document
-   `textSelectionButton`: switch to the text selection mode
-   `handToolButton`: switch to the hand tool mode
-   `verticalScrollingButton`: scroll the document vertically
-   `horizontalScrollingButton`: scroll the document horizontally
-   `wrappedScrollingButton`: display pages as a grid
-   `documentPropertiesButton`: show the document properties

## v1.2.1

**Improvement**

-   Make the spinner thiner
-   Add minified CSS files

**Bug fixes**

-   Tooltip for the left/right buttons don't look good in full width mode
-   The view now takes full height by default. It fixes the issue that users can't navigate between pages from the toolbar in some cases

## v1.2.0

**New features**

-   Provide the ability of printing document
-   Add new `selectionMode` option indicates the selection mode:

```javascript
import Viewer, { SelectionMode } from '@phuocng/react-pdf-viewer';

<Viewer
    fileUrl="/path/to/document.pdf"
    // By default, it will be SelectionMode.Text
    selectionMode={SelectionMode.Hand}
/>;
```

-   Add `onDocumentLoad` callback that uis invoked when the document is loaded completely

```javascript
import Viewer, { PdfJs } from '@phuocng/react-pdf-viewer';

const documentLoad = (doc: PdfJs.PdfDocument) => {
    console.log(`Document is loaded: ${doc.numPages}`);
};

<Viewer fileUrl="/path/to/document.pdf" onDocumentLoad={documentLoad} />;
```

-   Add `onZoom` callback that is invoked when zooming in/out the document

```javascript
import Viewer, { PdfJs } from '@phuocng/react-pdf-viewer';

const zoom = (doc: PdfJs.PdfDocument, scale: number) => {
    console.log(`Zoom document to ${scale}`);
};

<Viewer fileUrl="/path/to/document.pdf" onZoom={zoom} />;
```

## v1.1.0

**New features**

-   Add new, optional `defaultScale` parameter that indicates the default zoom level:

```javascript
<Viewer defaultScale={1.5} ... />
```

**Improvement**

-   The document should fit best in the container initially

## v1.0.2

**Improvement**

-   Support SSR

**Bug fixes**

-   Cannot re-export a type when --isolatedModules is set to true
-   The CSS files are missing in es6 package

## v1.0.0

First release
