/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs } from '../types/PdfJs';

enum PageRenderStatus {
    NotRenderedYet = 'NotRenderedYet',
    Rendering = 'Rendering',
    Rendered = 'Rendered',
}

interface PageVisibility {
    pageIndex: number;
    renderStatus: PageRenderStatus;
    visibility: number;
}

const OUT_OF_RANGE_VISIBILITY = -9999;

export const renderQueueService = (doc: PdfJs.PdfDocument) => {
    const { numPages } = doc;

    const getInitialPageVisibilities = (): PageVisibility[] =>
        Array(numPages)
            .fill(null)
            .map((_, pageIndex) => ({
                pageIndex,
                renderStatus: PageRenderStatus.NotRenderedYet,
                visibility: OUT_OF_RANGE_VISIBILITY,
            }));

    let pageVisibilities = getInitialPageVisibilities();

    const resetQueue = () => {
        pageVisibilities = getInitialPageVisibilities();
    };

    const markRendered = (pageIndex: number) => {
        pageVisibilities[pageIndex].renderStatus = PageRenderStatus.Rendered;
    };

    const setRange = (startIndex: number, endIndex: number) => {
        for (let i = 0; i < numPages; i++) {
            if (i < startIndex || i > endIndex) {
                pageVisibilities[i].visibility = OUT_OF_RANGE_VISIBILITY;
                pageVisibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
            }
        }
    };

    const setVisibility = (pageIndex: number, visibility: number) => {
        if (0 <= pageIndex && pageIndex < numPages) {
            pageVisibilities[pageIndex].visibility = visibility;
        }
    };

    // Render the next page in queue.
    // The next page is -1 in the case there's no page that need to be rendered or there is at least one page which has been rendering
    const getHighestPriorityPage = (): number => {
        // Find all visible pages
        const visiblePages = pageVisibilities.filter((item) => item.visibility > OUT_OF_RANGE_VISIBILITY);
        if (!visiblePages.length) {
            return -1;
        }
        const firstVisiblePage = visiblePages[0].pageIndex;
        const lastVisiblePage = visiblePages[visiblePages.length - 1].pageIndex;

        // Check if there is any visible page that has been rendering
        const hasRenderingPage = visiblePages.find((item) => item.renderStatus === PageRenderStatus.Rendering);
        if (hasRenderingPage) {
            // Wait until the page is rendered completely
            return -1;
        }

        // Find the most visible page that isn't rendered yet
        const notRenderedPages = visiblePages
            .filter((item) => item.renderStatus === PageRenderStatus.NotRenderedYet)
            .sort((a, b) => a.visibility - b.visibility);
        if (notRenderedPages.length) {
            const nextRenderPage = notRenderedPages[notRenderedPages.length - 1].pageIndex;
            pageVisibilities[nextRenderPage].renderStatus = PageRenderStatus.Rendering;
            return nextRenderPage;
        } else if (
            lastVisiblePage + 1 < numPages &&
            pageVisibilities[lastVisiblePage + 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // All visible pages are rendered
            // Render the page that is right after the last visible page ...
            return lastVisiblePage + 1;
        } else if (
            firstVisiblePage - 1 >= 0 &&
            pageVisibilities[firstVisiblePage - 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // ... or before the first visible one
            return firstVisiblePage - 1;
        }

        return -1;
    };

    return {
        getHighestPriorityPage,
        markRendered,
        resetQueue,
        setRange,
        setVisibility,
    };
};
