import React from "react";
import {useTableControl} from "@/Hooks/useTableControl";
import LoadingIcon from "@/Components/Base/LoadingIcon";
import {InlineTableSearch} from "@/Components/InlineTableSearch";
import {TablePagination} from "@/Components/TablePagination";
import PerPageSelect from "../Base/PerPageSelect";
import PageWidgets = App.Data.Tenant.Frontend.Widgets.PageWidgets;
import clsx from "clsx";

interface TableContainerProps {
  links: Array<App.Data.Tenant.Frontend.PaginationLinks> | null;
  total?: PageWidgets;
  children: React.ReactNode;
}

export function DataTable({links, total, children}: TableContainerProps) {
  const {loading, search, perPage, setSearch, setPerPage} = useTableControl();

  return (
    <div className="flex flex-col gap-8 mt-3.5">
      {total && (
        <div className="flex flex-col p-5 box box--stacked">
          <div className={clsx(
            "grid",
            "gap-5",
            `grid-cols-${total.widgets.length}`
          )}>
            {total.widgets.map((widget, key) => (
              <div key={key} className="col-span-4 md:col-span-2 xl:col-span-1 p-5 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                <div className="text-base text-slate-500">{widget.name}</div>
                <div className="mt-1.5 text-2xl font-medium">{widget.data} {widget.measureUnit && (widget.measureUnit)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col box box--stacked">
        <InlineTableSearch value={search}
                           onChange={setSearch} />
        <div className="overflow-auto xl:overflow-visible relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 bg-opacity-70 z-10">
              <LoadingIcon color="#0C4A6E"
                           icon="circles"
                           className="w-20 h-20" />
            </div>
          )}
          {children}
        </div>
        <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
          <TablePagination links={links} />
          <PerPageSelect value={perPage}
                         onChange={setPerPage} />
        </div>
      </div>
    </div>
  );
}
