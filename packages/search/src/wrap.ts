/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

const wrap = (ele: Node, startOffset: number, endOffset: number): HTMLElement => {
    const range = new Range();
    range.setStart(ele, startOffset);
    range.setEnd(ele, endOffset);

    const wrapper = document.createElement('span');
    range.surroundContents(wrapper);
    return wrapper;
};

export default wrap;
