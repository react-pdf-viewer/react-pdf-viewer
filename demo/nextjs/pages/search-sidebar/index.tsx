import { Viewer } from '@react-pdf-viewer/core';
import { RenderSearchProps, SearchPlugin, searchPlugin } from '@react-pdf-viewer/search';
import * as React from 'react';
import { SearchSidebarInner } from './SearchSidebarInner';

const SearchSidebar: React.FC<{
    searchPluginInstance: SearchPlugin;
}> = ({ searchPluginInstance }) => {
    const { Search } = searchPluginInstance;
    return (
        <Search>
            {(renderSearchProps: RenderSearchProps) => <SearchSidebarInner renderSearchProps={renderSearchProps} />}
        </Search>
    );
};

const IndexPage = () => {
    const searchPluginInstance = searchPlugin();

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, .2)',
                    flex: '0 0 15rem',
                    width: '15rem',
                }}
            >
                <SearchSidebar searchPluginInstance={searchPluginInstance} />
            </div>

            <div style={{ flex: 1 }}>
                <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[searchPluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
