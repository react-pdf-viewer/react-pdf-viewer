import Viewer, { CanvasLayerRenderEvent } from '@phuocng/react-pdf-viewer';
import React from 'react';

interface DrawCanvasExampleProps {
    fileUrl: string;
}

const DrawCanvasExample: React.FC<DrawCanvasExampleProps> = ({ fileUrl }) => {
    const message = "customer@email.com";

    const onCanvasLayerRender = (e: CanvasLayerRenderEvent) => {
        // `e.ele` is the canvas element
        const canvas = e.ele;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const fonts = ctx.font.split(' ');
        const fontSize = parseInt(fonts[0], 10);

        ctx.textAlign = 'center';
        ctx.font = `${fontSize * e.scale * 4}px ${fonts[1]}`;

        ctx.fillStyle = '#CCC';
        ctx.fillText(message, centerX, 100);
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            onCanvasLayerRender={onCanvasLayerRender}
        />
    );
};

export default DrawCanvasExample;
