export type PaginationMeta = {
    totalCount: number;
    page: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
}