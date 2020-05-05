import React from 'react';
import Viewer, { RenderPageProps } from '@phuocng/react-pdf-viewer';
import LinkifyWrapper from './LinkifyWrapper';

interface FindLinkExampleProps {
    fileUrl: string;
}

const FindLinkExample: React.FC<FindLinkExampleProps> = ({ fileUrl }) => {
    const renderPage = (props: RenderPageProps) => {
        return (
            <>
                {props.canvasLayer.children}
                <LinkifyWrapper>
                {props.textLayer.children}
                </LinkifyWrapper>
            </>
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            renderPage={renderPage}
        />
    );
};

export default FindLinkExample;
