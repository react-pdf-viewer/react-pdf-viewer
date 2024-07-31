/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';

export const useCollapse = (onToggle: () => void): [React.RefCallback<HTMLElement>, () => void, () => void] => {
    const [node, setNode] = React.useState<HTMLElement | null>(null);

    const ref = React.useCallback((ele: HTMLElement | null) => {
        setNode(ele);
    }, []);

    const collapse = React.useCallback(() => {
        if (!node) {
            return;
        }
        node.style.overflow = 'hidden';
        node.style.height = `${node.getBoundingClientRect().height}px`;
        const collapsingAnimation = node.animate(
            [
                {
                    height: `${node.scrollHeight}px`,
                },
                {
                    height: '0px',
                },
            ],
            {
                duration: 150,
            },
        );
        collapsingAnimation.finished.then(() => {
            node.style.display = 'none';
            node.style.overflow = '';
            onToggle();
        });
    }, [node]);

    const expand = React.useCallback(() => {
        if (!node) {
            return;
        }
        node.style.display = '';
        node.style.overflow = 'hidden';
        node.style.height = `${node.getBoundingClientRect().height}px`;
        const expandingAnimation = node.animate(
            [
                {
                    height: '0px',
                },
                {
                    height: `${node.scrollHeight}px`,
                },
            ],
            {
                duration: 150,
            },
        );
        expandingAnimation.finished.then(() => {
            node.style.height = '';
            node.style.overflow = '';
            onToggle();
        });
    }, [node]);

    return [ref, collapse, expand];
};
