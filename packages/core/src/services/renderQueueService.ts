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

interface RenderQueue {
    currentRenderingPage: number;
    startRange: number;
    endRange: number;
    visibilities: PageVisibility[];
}

export interface RenderQueueService {
    cleanup: () => void;
    getHighestPriorityPage: () => number;
    markRendered: (pageIndex: number) => void;
    markRendering: (pageIndex: number) => void;
    resetQueue: () => void;
    setRange: (startIndex: number, endIndex: number) => void;
    setVisibility: (pageIndex: number, visibility: number) => void;
}

let queues: Record<string, RenderQueue> = {};

export const renderQueueService = ({
    doc,
    queueName,
    priority,
}: {
    doc: PdfJs.PdfDocument;
    queueName: string;
    priority: number;
}): RenderQueueService => {
    const { numPages } = doc;

    // Generate a unique name for queue to make sure it works when switching documents
    const queue = `${queueName}___${doc.loadingTask.docId}`;

    const getInitialPageVisibilities = (): PageVisibility[] =>
        Array(numPages)
            .fill(null)
            .map((_, pageIndex) => ({
                pageIndex,
                renderStatus: PageRenderStatus.NotRenderedYet,
                visibility: -1,
            }));

    const cleanup = () => {
        queues[queue] = {
            currentRenderingPage: -1,
            startRange: 0,
            endRange: numPages - 1,
            visibilities: [],
        };
    };

    const resetQueue = () => {
        queues[queue] = {
            currentRenderingPage: -1,
            startRange: 0,
            endRange: numPages - 1,
            visibilities: getInitialPageVisibilities(),
        };
    };

    const markRendered = (pageIndex: number) => {
        queues[queue].visibilities[pageIndex].renderStatus = PageRenderStatus.Rendered;
    };

    const markRendering = (pageIndex: number) => {
        if (
            queues[queue].currentRenderingPage !== -1 &&
            queues[queue].currentRenderingPage !== pageIndex &&
            queues[queue].visibilities[queues[queue].currentRenderingPage].renderStatus === PageRenderStatus.Rendering
        ) {
            // The last rendering page isn't rendered completely
            queues[queue].visibilities[queues[queue].currentRenderingPage].renderStatus =
                PageRenderStatus.NotRenderedYet;
        }

        queues[queue].visibilities[pageIndex].renderStatus = PageRenderStatus.Rendering;
        queues[queue].currentRenderingPage = pageIndex;
    };

    const setRange = (startIndex: number, endIndex: number) => {
        queues[queue].startRange = startIndex;
        queues[queue].endRange = endIndex;

        for (let i = 0; i < numPages; i++) {
            if (i < startIndex || i > endIndex) {
                queues[queue].visibilities[i].visibility = -1;
                queues[queue].visibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
            }
        }
    };

    const setVisibility = (pageIndex: number, visibility: number) => {
        queues[queue].visibilities[pageIndex].visibility = visibility;
    };

    // Render the next page in queue.
    // The next page is -1 in the case there's no page that need to be rendered or there is at least one page which has been rendering
    const getHighestPriorityPage = (): number => {
        // Find all visible pages which belongs to the range
        const visiblePages = queues[queue].visibilities
            .slice(queues[queue].startRange, queues[queue].endRange + 1)
            .filter((item) => item.visibility >= 0);
        if (!visiblePages.length) {
            return -1;
        }
        const firstVisiblePage = visiblePages[0].pageIndex;
        const lastVisiblePage = visiblePages[visiblePages.length - 1].pageIndex;

        // Find the first visible page that isn't rendered yet
        const numVisiblePages = visiblePages.length;
        for (let i = 0; i < numVisiblePages; i++) {
            // There is a page that is being rendered
            if (visiblePages[i].renderStatus === PageRenderStatus.Rendering) {
                return -1;
            }
            if (visiblePages[i].renderStatus === PageRenderStatus.NotRenderedYet) {
                return visiblePages[i].pageIndex;
            }
        }

        // All visible pages are rendered
        if (
            lastVisiblePage + 1 < numPages &&
            queues[queue].visibilities[lastVisiblePage + 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // All visible pages are rendered
            // Render the page that is right after the last visible page ...
            return lastVisiblePage + 1;
        } else if (
            firstVisiblePage - 1 >= 0 &&
            queues[queue].visibilities[firstVisiblePage - 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // ... or before the first visible one
            return firstVisiblePage - 1;
        }

        return -1;
    };

    resetQueue();

    return {
        cleanup,
        getHighestPriorityPage,
        markRendered,
        markRendering,
        resetQueue,
        setRange,
        setVisibility,
    };
};
