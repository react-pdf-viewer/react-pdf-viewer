import React from 'react';
import linkifyElement from 'linkifyjs/element';

const LinkifyWrapper: React.FC<{}> = ({ children }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        // Wait for the text layer is ready
        // In the future, we should allow user to customize the text renderer when the text is already rendered
        setTimeout(() => {
            // Find all text elements
            container.querySelectorAll('.viewer-text').forEach((textEle) => {
                linkifyElement(textEle as HTMLElement, {
                    attributes: {
                        style: 'color: transparent; text-decoration: none;',
                    },
                });
            });
        }, 200);
    }, []);

    return (
        <div ref={containerRef}>{children}</div>
    );
};

export default LinkifyWrapper;
