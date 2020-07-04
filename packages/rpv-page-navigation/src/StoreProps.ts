import { ViewerState } from '@phuocng/rpv';

interface StoreProps {
    jumpToPage?(pageIndex: number): void;
    getViewerState?: () => ViewerState;
}

export default StoreProps;
