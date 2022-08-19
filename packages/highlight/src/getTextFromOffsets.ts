/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export const getTextFromOffsets = (
    textLayerDiv: HTMLElement,
    startDivIdx: number,
    startOffset: number,
    endDivIdx: number,
    endOffset?: number
): string => {
    const nodes: Node[] = [].slice.call(textLayerDiv.children);
    // need to include extra end node if the last node is a <br/> node without any text
    const extraEndNode = (nodes.length > endDivIdx + 1 && nodes[endDivIdx].nodeName == "BR");
    const selectedNodes = nodes.slice(startDivIdx, extraEndNode ? endDivIdx + 2 : endDivIdx + 1);
    const nodesText = selectedNodes.map((node) => node.textContent).join(' ');
    
    const offsetFromEnd = endOffset ? selectedNodes[selectedNodes.length - 1].textContent!.length - endOffset : 0;
    const selectText = nodesText.substring(startOffset, nodesText.length - offsetFromEnd);
    return selectText.replace(/\s\s+/g, ' ');   // remove duplicate spaces
};
