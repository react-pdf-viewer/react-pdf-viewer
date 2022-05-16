/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { HighlightPosition } from './types/HighlightPosition';
import type { OnHighlightKeyword } from './types/OnHighlightKeyword';

export const HightlightItem: React.FC<{
    position: HighlightPosition;
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}> = ({ position, onHighlightKeyword }) => {
    const containerRef = React.useRef<HTMLDivElement>();

    useIsomorphicLayoutEffect(() => {
        const highlightEle = containerRef.current;
        if (onHighlightKeyword && highlightEle) {
            onHighlightKeyword({
                highlightEle,
                keyword: position.keyword,
            });
        }
    }, []);

    return (
        <div
            className="rpv-search__highlight"
            ref={containerRef}
            style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                height: `${position.height}%`,
                width: `${position.width}%`,
            }}
            title={position.keywordStr.trim()}
        />
    );
};
