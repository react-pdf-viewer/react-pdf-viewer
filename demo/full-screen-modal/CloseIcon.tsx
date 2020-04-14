import { Icon } from '@phuocng/react-pdf-viewer';
import React from 'react';

const CloseIcon: React.FC<{}> = () => {
    return (
        <Icon size={12}>
            <path d="M23.5 0.5L0.5 23.5" />
            <path d="M23.5 23.5L0.5 0.5" />
        </Icon>        
    );
};

export default CloseIcon;
