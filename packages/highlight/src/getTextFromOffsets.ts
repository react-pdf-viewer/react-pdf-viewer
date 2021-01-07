/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

const getTextFromOffsets = (
    textLayerDiv: HTMLElement,
    startDivIdx: number,
    startOffset: number,
    endDivIdx: number,
    endOffset?: number
): string => {
    const nodes: Node[] = [].slice.call(textLayerDiv.children);

    if (startDivIdx < endDivIdx) {
        const startDivText = nodes
            .slice(startDivIdx, startDivIdx + 1)
            .map((node) => node.textContent.substring(startOffset).trim())
            .join(' ');

        const middleDivText = nodes
            .slice(startDivIdx + 1, endDivIdx)
            .map((node) => node.textContent.trim())
            .join(' ');

        const endDivText = nodes
            .slice(endDivIdx, endDivIdx + 1)
            .map((endDiv) =>
                endDiv.textContent.substring(
                    0,
                    endOffset || endDiv.textContent.length
                )
            )
            .join(' ');
        return `${startDivText} ${middleDivText} ${endDivText}`;
    } else {
        const div = nodes[startDivIdx];
        return div.textContent
            .substring(startOffset, endOffset || div.textContent.length)
            .trim();
    }
};

export default getTextFromOffsets;
