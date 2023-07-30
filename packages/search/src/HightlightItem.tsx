/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import * as React from 'react';
import { getCssProperties } from './getCssProperties';
import { type OnHighlightKeyword } from './types/OnHighlightKeyword';
import { type HighlightArea } from './types/RenderHighlightsProps';

export const HightlightItem: React.FC<{
    index: number;
    area: HighlightArea;
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}> = ({ index, area, onHighlightKeyword }) => {
    const containerRef = React.useRef<HTMLDivElement>();

    useIsomorphicLayoutEffect(() => {
        const highlightEle = containerRef.current;
        if (onHighlightKeyword && highlightEle) {
            onHighlightKeyword({
                highlightEle,
                keyword: area.keyword,
            });
        }
    }, []);

    return (
        <div
            className="rpv-search__highlight"
            data-index={index}
            ref={containerRef}
            style={getCssProperties(area)}
            title={area.keywordStr.trim()}
        />
    );
};
