/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type Plugin, type RenderViewer, type Slot } from '@react-pdf-viewer/core';
import * as React from 'react';
import { DropArea } from './DropArea';

export const dropPlugin = (): Plugin => {
    const renderViewer = (props: RenderViewer): Slot => {
        const { slot } = props;

        if (slot.attrs) {
            const styles = slot.attrs && slot.attrs.style ? slot.attrs.style : {};
            const updateStyle: React.CSSProperties = {
                ...styles,
                ...{
                    height: '100%',
                    position: 'relative',
                    width: '100%',
                },
            };
            slot.attrs.style = updateStyle;
        }

        slot.children = (
            <>
                <DropArea containerRef={props.containerRef} openFile={props.openFile} />
                {slot.children}
            </>
        );

        return slot;
    };

    return {
        renderViewer,
    };
};
