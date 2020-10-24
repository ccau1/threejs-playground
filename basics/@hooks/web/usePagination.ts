import { useState, useEffect } from "react";

interface UsePaginationOptions<Item, Filters> {
  limit: number;
  filters?: Filters;
  fetchApi: (
    pagination: PaginateQueries,
    filters?: Filters,
  ) => Promise<PaginateResult<Item>>;
  onlyFetchOnce?: boolean;
}

const usePagination = <Item = any, Filters = any>({
  limit,
  filters,
  fetchApi,
  onlyFetchOnce,
}: UsePaginationOptions<Item, Filters>) => {
  // define pagination state for initial and reset
  const initialPaginationState = {
    hasNextPage: true,
    hasPrevPage: false,
    limit,
    nextPage: 2,
    page: 1,
    pagingCounter: 1,
    prevPage: 0,
    totalDocs: 0,
    totalPages: 0,
  };

  // define isLoading for fetchApi
  const [isLoading, setIsLoading] = useState(false);

  // fetchApi result pagination
  const [paginationState, setPaginationState] = useState<PaginateResultState>(
    initialPaginationState,
  );

  // internal pagination
  const [pagination, setPagination] = useState<PaginateQueries>({
    limit: initialPaginationState.limit,
    page: initialPaginationState.page,
  });

  // fetched accumulated items
  const [items, setItems] = useState<Item[]>([]);

  // reset pagination
  const resetPagination = () => {
    setItems([]);
    setPaginationState(initialPaginationState);
    setPagination({ limit, page: 1 });
  };

  // // on set criteria changed, reset pagination
  useEffect(() => {
    // if filters or limit changed, reset pagination
    resetPagination();
  }, [filters, limit]);

  // on set criteria change, fetch api for more items
  // and update pagination
  useEffect(() => {
    (async () => {
      if ((onlyFetchOnce && items.length) || isLoading) return;
      setIsLoading(true);

      // some fields has changed, fetch more items via fetchApi
      const { docs, ...pState } = await fetchApi(pagination, filters);
      setItems([...items, ...docs]);
      setPaginationState(pState);
      // TODO: pagination not in dependency, issue?
      setPagination({ ...pagination, page: pState.page });
      setIsLoading(false);
    })();
  }, [pagination, onlyFetchOnce]);

  // on fetch more, add 1 to page, which will trigger above
  // useEffect to call fetchApi
  const fetchMore = () => {
    if (isLoading || !paginationState.hasNextPage) return;
    setPagination({ ...pagination, page: (pagination.page || 1) + 1 });
  };

  const removeItems = (itemIds: string[]) => {
    setItems(items.filter((i) => !itemIds.includes((i as any)._id)));
  };

  // return fields for display and controls
  return {
    reset: resetPagination,
    items,
    fetchMore,
    pagination: paginationState,
    isLoading,
    removeItems,
  };
};

export default usePagination;
