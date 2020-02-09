# CHANGELOG

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