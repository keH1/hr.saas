import AppLayout from "@/Layouts/Tenant/AppLayout";
import {Head, Link} from '@inertiajs/react';
import React from "react";

import Lucide from "@/Components/Base/Lucide";
import {FormCheck} from "@/Components/Base/Form";
import Tippy from "@/Components/Base/Tippy";
import Button from "@/Components/Base/Button";
import Table from "@/Components/Base/Table";
import {PageProps} from "@/types";
import {DataTable} from "@/Components/DataTable";
import Plots = App.Data.Tenant.Frontend.Table.Plots;
import PageWidgets = App.Data.Tenant.Frontend.Widgets.PageWidgets;

interface PlotsList extends PageProps {
  plots: Plots;
  total?: PageWidgets;
}

export default function List({plots, total}: PlotsList) {
  return (
    <AppLayout>
      <Head title="Участки" />

      <div className="grid grid-cols-12 gap-y-10 gap-x-6">
        <div className="col-span-12">
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div className="text-base font-medium group-[.mode--light]:text-white">
              Участки
            </div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
              <Button
                as={Link}
                href={route('dashboard')}
                variant="primary"
                className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
              >
                <Lucide icon="PenLine"
                        className="stroke-[1.3] w-4 h-4 mr-2" />{" "}
                Добавить участок
              </Button>
            </div>
          </div>
          <DataTable links={plots.links} total={total}>
            <Table className="border-b border-slate-200/60">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                    <FormCheck.Input type="checkbox" />
                  </Table.Th>
                  <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 w-1">
                    Участок
                  </Table.Th>
                  <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                    Информация о участке
                  </Table.Th>
                  <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                    Кадастровый номер
                  </Table.Th>
                  <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500">
                    Площадь (м²)
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {plots.data && plots.data.map((plot, key) => (
                  <Table.Tr key={key}
                            className="[&_td]:last:border-b-0">
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <FormCheck.Input type="checkbox" />
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-center">
                      {plot.plot_number}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed w-80 dark:bg-darkmode-600">
                      <div className="flex items-center">
                        <div className="w-9 h-9 image-fit zoom-in">
                          <Tippy
                            as="img"
                            alt="Tailwise - Admin Dashboard Template"
                            className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                            src="https://vite.hr.saas/public/images/users/user8-50x50.jpg"
                            content={`${plot.plot_number}`}
                          />
                        </div>
                        <div className="ml-3.5">
                          <Link
                            href={route('dashboard')}
                            className="font-medium whitespace-nowrap"
                          >
                            {plot.owners && plot.owners.length > 0 && (
                              `${plot.owners[0].last_name} ${plot.owners[0].first_name} ${plot.owners[0].middle_name}`
                            )}

                          </Link>
                          <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                            ул. {plot.street.name} {plot.plot_number}
                          </div>
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      {plot.cadastre_number}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      {plot.area} м²
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </DataTable>
        </div>
      </div>
    </AppLayout>
  );
}
