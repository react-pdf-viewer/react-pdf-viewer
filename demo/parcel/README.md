This folder demonstrates how to bundle React PDF viewer with [Parcel](https://parceljs.org)

1. Install the dependencies

~~~
npm install
~~~

2. Build

~~~
npm run build
~~~

3. Running locally

~~~
npm run dev
~~~

Visit http://localhost:8001/. You can change the port `8001` in the `package.json` file:

~~~ 
{
    ...,
    "scripts": {
        "dev": "npm run copy && parcel src/index.html --out-dir dist --port 8001"
    },
}
~~~
