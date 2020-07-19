# download plugin

This plugin allows user to download the current file.

~~~ javascript
import downloadPlugin from '@phuocng/rpv-download';

const downloadPluginInstance = downloadPlugin();

// The button to download the current file
const { DownloadButton } = downloadPluginInstance;

// Render
return (
    <>
    <DownloadButton />
    <Viewer
        plugins={[
            downloadPluginInstance,
        ]}
    >
    </>
);
~~~

## Use a custom button

~~~ javascript
import downloadPlugin from '@phuocng/rpv-download';

const downloadPluginInstance = downloadPlugin();

// The button to download the current file
const { DownloadButton } = downloadPluginInstance;

// Render
return (
    <>
    <DownloadButton>
    {
        (props) => (
            // Your custom button here
            <button onClick={props.onClick}>
                Download
            </button>
        )
    }
    </OpenButton>
    <Viewer
        plugins={[
            downloadPluginInstance,
        ]}
    >
    </>
);
~~~