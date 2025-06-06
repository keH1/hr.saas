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

export default function Detail() {
  return (
    <AppLayout>
      <Head title="Садовод" />

      А вот и наш садовод

    </AppLayout>
  );
}
