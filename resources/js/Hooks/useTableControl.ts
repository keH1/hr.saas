import {useCallback, useState} from "react";
import {router, usePage} from "@inertiajs/react";
import {debounce, pickBy} from "lodash";
import {PageProps} from "@/types";

export function useTableControl() {
  const {listPageProps, queryParams} = usePage<PageProps>().props;

  const initialSearch = queryParams.q || "";
  const initialPerPage = queryParams.pp || listPageProps.defaultPerPage;

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [perPage, setPerPage] = useState(initialPerPage);

  const fetchData = useCallback(
    debounce((query: string, perPage: number) => {
      setLoading(true);
      router.get(route(route().current() || ''), pickBy({
        q: query,
        pp: perPage != listPageProps.defaultPerPage ? perPage : undefined
      }), {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => setLoading(false),
      });
    }, 500),
    []
  );

  const handleSearch = (query: string) => {
    setSearch(query);
    fetchData(query, perPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    fetchData(search, newPerPage);
  };

  return {
    loading,
    search,
    perPage,
    setSearch: handleSearch,
    setPerPage: handlePerPageChange,
  };
}
