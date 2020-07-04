import React, { useContext, useState } from 'react';
import { Button, LocalizationContext, LocalizationMap, MenuItem, Popover, Position, Toggle, Tooltip } from '@phuocng/rpv';

import LocaleIcon from './LocaleIcon';

export interface LocalePopoverProps {
    initialLocale?: string;
    locales: {
        [locale: string]: string,
    };
    localizations: {
        [locale: string]: LocalizationMap,
    };
    onUpdateLocalization: (localization: LocalizationMap) => void;
}

const LocalePopover: React.FC<LocalePopoverProps> = ({ initialLocale = 'en_US', locales, localizations, onUpdateLocalization }) => {
    const l10n = useContext(LocalizationContext);
    const [locale, setLocale] = useState(initialLocale);

    const renderTarget = (toggle: Toggle, opened: boolean) => {
        const label = (l10n && l10n.plugins)
            ? l10n.plugins.localeSwitcher.switchLocale
            : 'Switch locale';

        return (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={toggle} isSelected={opened}><LocaleIcon /></Button>}
                content={() => label}
                offset={{ left: 0, top: 8 }}
            />
        );
    };

    const renderContent = (toggle: Toggle) => {
        const changeLocale = (newLocale: string) => {
            setLocale(newLocale);
            onUpdateLocalization(localizations[newLocale] || {});
            toggle();
        };

        return (
            <ul
                style={{
                    listStyleType: 'none',
                    margin: 0,
                    padding: 0,
                }}
            >
                {
                    Object.keys(locales).map(loc => {
                        return (
                            <MenuItem
                                key={loc}
                                checked={locale === loc}
                                onClick={() => changeLocale(loc)}
                            >
                                {locales[loc]}
                            </MenuItem>
                        );
                    })
                }
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
