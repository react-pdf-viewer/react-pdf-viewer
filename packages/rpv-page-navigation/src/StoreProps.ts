interface StoreProps {  
    currentPage?: number;
    jumpToPage?(pageIndex: number): void;
    numberOfPages?: number;
}

export default StoreProps;
