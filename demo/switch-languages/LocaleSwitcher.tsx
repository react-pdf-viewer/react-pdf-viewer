import Viewer, {
    defaultLayout,
    LocalizationMap,
    RenderToolbar,
    RenderToolbarSlot,
    Slot,
    ToolbarSlot,
} from '@phuocng/react-pdf-viewer';
import React, { useState } from 'react';

import LocalePopover from './LocalePopover';
import vi_VN from './vi_VN.json';

interface LocaleSwitcherProps {
    fileUrl: string;
}

const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ fileUrl }) => {
    const [localization, setLocalization] = useState<LocalizationMap | undefined>(undefined);

    const activateLocale = (locale: string) => {
        switch (locale) {
            case 'vi_VN':
                setLocalization((vi_VN as any) as LocalizationMap);
                break;
            case 'en_US':
            default:
                setLocalization(undefined);
                break;
        }
    };

    const renderToolbar: RenderToolbarSlot = (toolbarSlot: ToolbarSlot): React.ReactElement => {
        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.toggleSidebarButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.searchPopover}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.previousPageButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.currentPageInput} / {toolbarSlot.numPages}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.nextPageButton}
                    </div>
                </div>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        flexGrow: 1,
                        flexShrink: 1,
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.zoomOutButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.zoomPopover}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.zoomInButton}
                    </div>
                </div>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        marginLeft: 'auto',
                    }}
                >
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.fullScreenButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.openFileButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.downloadButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.printButton}
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        <LocalePopover onActivateLocale={activateLocale} />
                    </div>
                    <div style={{ padding: '0 2px' }}>
                        {toolbarSlot.moreActionsPopover}
                    </div>
                </div>
            </div>
        );
    };

    const layout = (
        isSidebarOpened: boolean,
        container: Slot,
        main: Slot,
        toolbar: RenderToolbar,
        sidebar: Slot,
    ): React.ReactElement => {
        return defaultLayout(
            isSidebarOpened,
            container,
            main,
            toolbar(renderToolbar),
            sidebar,
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            layout={layout}
            localization={localization}
        />
    );
};

export default LocaleSwitcher;
