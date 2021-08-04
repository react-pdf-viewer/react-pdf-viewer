import * as React from 'react';
import { LocalizationMap, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { localeSwitcherPlugin } from '@react-pdf-viewer/locale-switcher';
import { MoreActionsPopover } from '@react-pdf-viewer/toolbar';

import de_DE from './de_DE.json';
import en_US from './en_US.json';
//import vi_VN from './vi_VN.json';

interface SwitchLocalizationExampleProps {
    fileUrl: string;
}

const SwitchLocalizationExample: React.FC<SwitchLocalizationExampleProps> = ({ fileUrl }) => {
    const [l10n, setL10n] = React.useState(de_DE as unknown as LocalizationMap);
    const [locale, setLocale] = React.useState('de_DE');
    const updateLocalization = (newLocale: string, newL10n: LocalizationMap) => {
        setLocale(newLocale);
        setL10n(newL10n);
    };

    const localeSwitcherPluginInstance = localeSwitcherPlugin();
    const { LocalePopover } = localeSwitcherPluginInstance;

    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>
            {(toolbarSlot: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    Download,
                    EnterFullScreen,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    Open,
                    Print,
                    ShowSearchPopover,
                    SwitchTheme,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                } = toolbarSlot;

                return (
                    <div className="rpv-toolbar" role="toolbar" aria-orientation="horizontal">
                        <div className="rpv-toolbar__left">
                            <div className="rpv-toolbar__item">
                                <ShowSearchPopover />
                            </div>
                            <div className="rpv-core__display--hidden rpv-core__display--block-small">
                                <div className="rpv-toolbar__item">
                                    <GoToPreviousPage />
                                </div>
                            </div>
                            <div className="rpv-toolbar__item">
                                <CurrentPageInput />{' '}
                                <span className="rpv-toolbar__label">
                                    / <NumberOfPages />
                                </span>
                            </div>
                            <div className="rpv-core__display--hidden rpv-core__display--block-small">
                                <div className="rpv-toolbar__item">
                                    <GoToNextPage />
                                </div>
                            </div>
                        </div>
                        <div className="rpv-toolbar__center">
                            <div className="rpv-toolbar__item">
                                <ZoomOut />
                            </div>
                            <div className="rpv-core__display--hidden rpv-core__display--block-small">
                                <div className="rpv-toolbar__item">
                                    <Zoom />
                                </div>
                            </div>
                            <div className="rpv-toolbar__item">
                                <ZoomIn />
                            </div>
                        </div>
                        <div className="rpv-toolbar__right">
                            <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                                <div className="rpv-toolbar__item">
                                    <SwitchTheme />
                                </div>
                            </div>
                            <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                                <div className="rpv-toolbar__item">
                                    <EnterFullScreen />
                                </div>
                            </div>
                            <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                                <div className="rpv-toolbar__item">
                                    <Open />
                                </div>
                            </div>
                            <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                                <div className="rpv-toolbar__item">
                                    <Download />
                                </div>
                            </div>
                            <div className="rpv-core__display--hidden rpv-core__display--block-medium">
                                <div className="rpv-toolbar__item">
                                    <Print />
                                </div>
                            </div>
                            <div className="rpv-toolbar__item">
                                <LocalePopover
                                    initialLocale={locale}
                                    locales={{
                                        de_DE: 'German',
                                        en_US: 'English',
                                        //vi_VN: 'Tiếng Việt',
                                    }}
                                    localizations={{
                                        de_DE: de_DE as any as LocalizationMap,
                                        en_US: en_US as any as LocalizationMap,
                                        //vi_VN: vi_VN as any as LocalizationMap,
                                    }}
                                    onUpdateLocalization={updateLocalization}
                                />
                            </div>
                            <div className="rpv-toolbar__item">
                                <MoreActionsPopover toolbarSlot={toolbarSlot} />
                            </div>
                        </div>
                    </div>
                );
            }}
        </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });

    return (
        <Viewer
            fileUrl={fileUrl}
            localization={l10n}
            plugins={[defaultLayoutPluginInstance, localeSwitcherPluginInstance]}
        />
    );
};

export default SwitchLocalizationExample;
