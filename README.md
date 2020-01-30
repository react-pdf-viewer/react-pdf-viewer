# React PDF viewer
A React component to view a PDF document.
It's written in TypeScript, and powered by React hooks.

![React PDF viewer](https://raw.githubusercontent.com/phuoc-ng/react-pdf-viewer/master/assets/screenshot.png)

## Features

__Basic features__
* [x] Support password protected document
* [x] Zooming: Support custom levels such as actual size, page fit, and page width
* [x] Navigation between pages
* [x] Can go to the first and last pages quickly
* [x] Search for text
* [x] Preview page thumbnails
* [x] View and navigate the table of contents
* [x] List and download attachments
* [x] Rotating
* [x] Text selection and hand tool modes
* [x] Different scrolling modes
* [x] Full screen mode
* [x] Can open a file from local. Users can drag and drop a local file to view it
* [x] Download file
* [x] View the document properties

__Customization__
* [x] The toolbar can be customized easily
* [x] All text items can be localized in another language

__Coming soon__
* [ ] Theming
* [ ] Darkmode

## Commands

1. Build:

~~~
$ npm run build
~~~

Then it will produce two formats available in the `dist` folder:

~~~
└─── dist
    ├─── cjs    // CommonJS package
    └─── umd    // UMD package
~~~

2. Lint:

~~~
$ npm run lint
~~~

It will check if the entire source code compatible with [TSLint](https://palantir.github.io/tslint/). The `tslint.log` file will let us know if there's any file which doesn't pass the checks.

## License
Purchase a Commercial License at the [official website](https://react-pdf-viewer.dev)

## About

This project is developed by [Nguyen Huu Phuoc](https://twitter.com/nghuuphuoc).
You might be interesting in my projects:

| Product                                       | Description                                                       |
|-----------------------------------------------|-------------------------------------------------------------------|
| [FormValidation](https://formvalidation.io)   | The best validation library for JavaScript                        |
| [BlurPage](https://blur.page)                 | A browser extension to hide sensitive information on a web page   |
| [CSS Layout](https://csslayout.io)            | A collection of popular layouts and patterns made with CSS        |
