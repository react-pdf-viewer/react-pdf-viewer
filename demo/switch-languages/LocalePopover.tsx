import {
    Button,
    MenuItem,
    Popover,
    Position,
    Toggle,
    Tooltip,
} from '@phuocng/react-pdf-viewer';
import React, { useState } from 'react';

import LocaleIcon from './LocaleIcon';

interface LocalePopoverProps {
    onActivateLocale(locale: string): void;
}

const LocalePopover: React.FC<LocalePopoverProps> = ({ onActivateLocale }) => {
    const [locale, setLocale] = useState('en_US');
    const renderLocale = () => {
        const renderLocaleLabel = () => {
            switch (locale) {
                case 'vi_VN':
                    return 'Chuyển ngôn ngữ';
                case 'en_US':
                default:
                    return 'Switch locale';
            }
        };

        return renderLocaleLabel();
    };

    const renderTarget = (toggle: Toggle, opened: boolean) => (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={toggle} isSelected={opened}><LocaleIcon /></Button>}
            content={renderLocale}
            offset={{ left: 0, top: 8 }}
        />
    );

    const renderContent = (toggle: Toggle) => {
        const changeLocale = (newLocale: string) => {
            setLocale(newLocale);
            onActivateLocale(newLocale);
            toggle();
        };
        const switchToVietnamese = () => changeLocale('vi_VN');
        const switchToEnglish = () => changeLocale('en_US');

        return (
            <ul
                style={{
                    listStyleType: 'none',
                    margin: 0,
                    padding: 0,
                }}
            >
                <MenuItem
                    checked={locale === 'vi_VN'}
                    onClick={switchToVietnamese}
                >
                    Tiếng Việt
                </MenuItem>
                <MenuItem
                    checked={locale === 'en_US'}
                    onClick={switchToEnglish}
                >
                    English
                </MenuItem>
            </ul>
        );
    };

    return (
        <Popover
            position={Position.BottomRight}
            target={renderTarget}
            content={renderContent}
            offset={{ left: 0, top: 8 }}
            closeOnClickOutside={true}
            closeOnEscape={true}
        />
    );
};

export default LocalePopover;
