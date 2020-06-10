import React from 'react';
import Viewer, { RenderToolbar, Slot } from '@phuocng/react-pdf-viewer';

interface WithoutToolbarExampleProps {
    fileUrl: string;
}

const WithoutToolbarExample: React.FC<WithoutToolbarExampleProps> = ({ fileUrl }) => {
    const layout = (
        isSidebarOpened: boolean,
        container: Slot,
        main: Slot,
        toolbar: RenderToolbar,
        sidebar: Slot,
    ): React.ReactElement => {
        return (
            <div
                {...container.attrs}
                style={Object.assign({}, {
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '100%',
                    overflow: 'hidden',
                    width: '100%',
                }, container.attrs.style)}
            >
                {container.children}
                <div
                    {...main.attrs}
                    style={Object.assign({}, {
                        height: '100%',
                        overflow: 'scroll',
                    }, main.attrs.style)}
                >
                    {main.children}
                </div>
            </div>
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            layout={layout}
        />
    );
};

export default WithoutToolbarExample;
