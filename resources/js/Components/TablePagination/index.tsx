import React from "react";
import Pagination from "@/Components/Base/Pagination";
import Lucide from "@/Components/Base/Lucide";

interface PaginationControlProps {
  links: Array<App.Data.Tenant.Frontend.PaginationLinks> | null;
}

export function TablePagination({links}: PaginationControlProps) {
  return (
    <>
      {(links &&
          <Pagination className="flex-1 w-full mr-auto sm:w-auto">
            {links.map((pagination, key) => {
              if (pagination.label === 'pagination.previous') {
                return (
                  <Pagination.Link key={key}
                                   href={pagination.url}>
                    <Lucide icon="ChevronLeft"
                            className="w-4" />
                  </Pagination.Link>
                );
              } else if (pagination.label === 'pagination.next') {
                return (
                  <Pagination.Link key={key}
                                   href={pagination.url}>
                    <Lucide icon="ChevronRight"
                            className="w-4" />
                  </Pagination.Link>
                );
              } else {
                return (
                  <Pagination.Link key={key}
                                   active={pagination.active}
                                   href={pagination.url}>
                    {pagination.label}
                  </Pagination.Link>
                );
              }
            })}
          </Pagination>
      )}
    </>
  );
}
