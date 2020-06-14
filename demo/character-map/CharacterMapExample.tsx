import React from 'react';
import Viewer, { CharacterMap } from '@phuocng/react-pdf-viewer';

interface CharacterMapExampleProps {
    fileUrl: string;
}

const CharacterMapExample: React.FC<CharacterMapExampleProps> = ({ fileUrl }) => {
    const characterMap: CharacterMap = {
        isCompressed: true,
        url: 'https://unpkg.com/pdfjs-dist@2.4.456/cmaps/',
    };

    return (
        <div style={{ height: '750px', padding: '16px 0' }}>
            <Viewer
                characterMap={characterMap}
                fileUrl={fileUrl}
            />
        </div>
    );
};

export default CharacterMapExample;
