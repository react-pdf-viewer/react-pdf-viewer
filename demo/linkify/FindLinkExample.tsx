import Viewer, { TextLayerRenderEvent } from '@phuocng/react-pdf-viewer';
import linkifyElement from 'linkifyjs/element';
import React from 'react';

interface FindLinkExampleProps {
    fileUrl: string;
}

const FindLinkExample: React.FC<FindLinkExampleProps> = ({ fileUrl }) => {
    const onTextLayerRender = (e: TextLayerRenderEvent) => {
        // Find all text elements
        e.ele.querySelectorAll('.viewer-text').forEach((textEle) => {
            linkifyElement(textEle as HTMLElement, {
                attributes: {
                    style: 'color: transparent; text-decoration: none;',
                },
            });
        });
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            onTextLayerRender={onTextLayerRender}
        />
    );
};

export default FindLinkExample;
