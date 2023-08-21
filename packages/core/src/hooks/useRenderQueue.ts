/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { type PdfJs } from '../types/PdfJs';

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

export interface UseRenderQueue {
    getHighestPriorityPage: () => number;
    isInRange: (pageIndex: number) => boolean;
    markNotRendered: () => void;
    markRendered: (pageIndex: number) => void;
    markRendering: (pageIndex: number) => void;
    setOutOfRange: (pageIndex: number) => void;
    setRange: (startIndex: number, endIndex: number) => void;
    setVisibility: (pageIndex: number, visibility: number) => void;
}

const OUT_OF_RANGE_VISIBILITY = -9999;

export const useRenderQueue = ({ doc }: { doc: PdfJs.PdfDocument }): UseRenderQueue => {
    const { numPages } = doc;
    const docId = doc.loadingTask.docId;

    const initialPageVisibilities = React.useMemo<PageVisibility[]>(
        () =>
            Array(numPages)
                .fill(null)
                .map((_, pageIndex) => ({
                    pageIndex,
                    renderStatus: PageRenderStatus.NotRenderedYet,
                    visibility: OUT_OF_RANGE_VISIBILITY,
                })),
        [docId],
    );

    const latestRef = React.useRef<RenderQueue>({
        currentRenderingPage: -1,
        startRange: 0,
        endRange: numPages - 1,
        visibilities: initialPageVisibilities,
    });

    // Mark all pages as not rendered yet
    const markNotRendered = () => {
        for (let i = 0; i < numPages; i++) {
            latestRef.current.visibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
        }
    };

    const markRendered = (pageIndex: number) => {
        // Don't compare the `pageIndex` with the `currentRenderingPage`
        // because there is a case a page need to be marked as rendered
        latestRef.current.visibilities[pageIndex].renderStatus = PageRenderStatus.Rendered;
    };

    const markRendering = (pageIndex: number) => {
        if (
            latestRef.current.currentRenderingPage !== -1 &&
            latestRef.current.currentRenderingPage !== pageIndex &&
            latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus ===
                PageRenderStatus.Rendering
        ) {
            // The last rendering page isn't rendered completely
            latestRef.current.visibilities[latestRef.current.currentRenderingPage].renderStatus =
                PageRenderStatus.NotRenderedYet;
        }

        latestRef.current.visibilities[pageIndex].renderStatus = PageRenderStatus.Rendering;
        latestRef.current.currentRenderingPage = pageIndex;
    };

    const setRange = (startIndex: number, endIndex: number) => {
        latestRef.current.startRange = startIndex;
        latestRef.current.endRange = endIndex;

        for (let i = 0; i < numPages; i++) {
            if (i < startIndex || i > endIndex) {
                latestRef.current.visibilities[i].visibility = OUT_OF_RANGE_VISIBILITY;
                latestRef.current.visibilities[i].renderStatus = PageRenderStatus.NotRenderedYet;
            } else if (latestRef.current.visibilities[i].visibility === OUT_OF_RANGE_VISIBILITY) {
                // Reset to -1, so the unit tests can determine the next page in the queue to be rendered
                latestRef.current.visibilities[i].visibility = -1;
            }
        }
    };

    const setOutOfRange = (pageIndex: number) => {
        setVisibility(pageIndex, OUT_OF_RANGE_VISIBILITY);
    };

    const setVisibility = (pageIndex: number, visibility: number) => {
        latestRef.current.visibilities[pageIndex].visibility = visibility;
    };

    // Render the next page in queue.
    // The next page is -1 in the case there's no page that need to be rendered or there is at least one page which has been rendering
    const getHighestPriorityPage = (): number => {
        // Find all visible pages which belongs to the range
        const visiblePages = latestRef.current.visibilities
            .slice(latestRef.current.startRange, latestRef.current.endRange + 1)
            .filter((item) => item.visibility > OUT_OF_RANGE_VISIBILITY);
        if (!visiblePages.length) {
            return -1;
        }
        const firstVisiblePage = visiblePages[0].pageIndex;
        const lastVisiblePage = visiblePages[visiblePages.length - 1].pageIndex;

        // Find the most visible page that isn't rendered yet
        const numVisiblePages = visiblePages.length;
        let maxVisibilityPageIndex = -1;
        let maxVisibility = -1;
        for (let i = 0; i < numVisiblePages; i++) {
            // There is a page that is being rendered
            if (visiblePages[i].renderStatus === PageRenderStatus.Rendering) {
                return -1;
            }
            if (visiblePages[i].renderStatus === PageRenderStatus.NotRenderedYet) {
                if (maxVisibilityPageIndex === -1 || visiblePages[i].visibility > maxVisibility) {
                    maxVisibilityPageIndex = visiblePages[i].pageIndex;
                    maxVisibility = visiblePages[i].visibility;
                }
            }
        }
        if (maxVisibilityPageIndex > -1) {
            return maxVisibilityPageIndex;
        }

        // All visible pages are rendered
        if (
            lastVisiblePage + 1 < numPages &&
            latestRef.current.visibilities[lastVisiblePage + 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // All visible pages are rendered
            // Render the page that is right after the last visible page ...
            return lastVisiblePage + 1;
        } else if (
            firstVisiblePage - 1 >= 0 &&
            latestRef.current.visibilities[firstVisiblePage - 1].renderStatus !== PageRenderStatus.Rendered
        ) {
            // ... or before the first visible one
            return firstVisiblePage - 1;
        }

        return -1;
    };

    const isInRange = (pageIndex: number) =>
        pageIndex >= latestRef.current.startRange && pageIndex <= latestRef.current.endRange;

    return {
        getHighestPriorityPage,
        isInRange,
        markNotRendered,
        markRendered,
        markRendering,
        setOutOfRange,
        setRange,
        setVisibility,
    };
};
