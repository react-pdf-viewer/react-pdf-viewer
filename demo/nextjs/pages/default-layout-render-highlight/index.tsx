import { Popover, Position, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { type RenderHighlightsProps } from '@react-pdf-viewer/search';
import * as React from 'react';

const IndexPage = () => {
    const renderHighlights = React.useCallback(
        (renderProps: RenderHighlightsProps) => (
            <>
                {renderProps.highlightAreas.map((area, index) => {
                    return (
                        <div
                            key={`${area.pageIndex}-${index}`}
                            style={{
                                ...renderProps.getCssProperties(area),
                                position: 'absolute',
                            }}
                        >
                            <Popover
                                closeOnClickOutside={true}
                                closeOnEscape={true}
                                content={() => (
                                    <div style={{ padding: '0.5rem', width: '12rem' }}>More information go here</div>
                                )}
                                position={Position.BottomCenter}
                                target={(toggle) => (
                                    <Tooltip
                                        content={() => 'Click to see more information'}
                                        position={Position.BottomCenter}
                                        target={
                                            <div
                                                className="rpv-search__highlight"
                                                data-index={index}
                                                style={{
                                                    left: 0,
                                                    position: 'absolute',
                                                    top: 0,
                                                    height: '100%',
                                                    width: '100%',
                                                }}
                                                title={area.keywordStr.trim()}
                                                onClick={() => toggle()}
                                            />
                                        }
                                    />
                                )}
                            />
                        </div>
                    );
                })}
            </>
        ),
        [],
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            searchPlugin: {
                renderHighlights,
            },
        },
    });

    return (
        <div
            style={{
                display: 'flex',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

export default IndexPage;
